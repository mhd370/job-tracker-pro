import * as React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useJobs } from "../context/JobsContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS = [
  { value: "priority", label: "Priority (Follow-up first)" },
  { value: "applied_new", label: "Applied Date (Newest)" },
  { value: "applied_old", label: "Applied Date (Oldest)" },
  { value: "company_az", label: "Company (A → Z)" },
];

function statusLabel(v) {
  return STATUS_OPTIONS.find((x) => x.value === v)?.label ?? v;
}

function dateToMs(dateStr) {
  if (!dateStr) return null;
  const ms = Date.parse(dateStr);
  return Number.isNaN(ms) ? null : ms;
}

function csvEscape(value) {
  const v = String(value ?? "");
  const needsQuotes = /[",\n]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function buildCsv(rows) {
  const header = [
    "Company",
    "Role",
    "Location",
    "Status",
    "AppliedDate",
    "FollowUpDate",
    "Link",
    "Notes",
    "CreatedAt",
  ];

  const lines = [header.join(",")];

  rows.forEach((j) => {
    lines.push(
      [
        csvEscape(j.company),
        csvEscape(j.role),
        csvEscape(j.location),
        csvEscape(j.status),
        csvEscape(j.appliedDate),
        csvEscape(j.followUpDate),
        csvEscape(j.link),
        csvEscape(j.notes),
        csvEscape(j.createdAt),
      ].join(",")
    );
  });

  return lines.join("\n");
}

export default function JobsPage() {
  const { jobs, deleteJob } = useJobs();
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [sort, setSort] = React.useState("priority");

  const [confirm, setConfirm] = React.useState({
    open: false,
    id: null,
    title: "",
  });

  const [snack, setSnack] = React.useState({
    open: false,
    message: "",
  });

  const askDelete = (job) => {
    setConfirm({
      open: true,
      id: job.id,
      title: `${job.company} — ${job.role}`,
    });
  };

  const closeConfirm = () => {
    setConfirm({ open: false, id: null, title: "" });
  };

  const closeSnack = () => {
    setSnack({ open: false, message: "" });
  };

  const confirmDelete = () => {
    if (confirm.id) {
      deleteJob(confirm.id);
      setSnack({ open: true, message: "Application deleted" });
    }
    closeConfirm();
  };

  const filteredAndSorted = React.useMemo(() => {
    const filtered = jobs.filter((j) => {
      const text = `${j.company} ${j.role} ${j.location || ""}`.toLowerCase();
      const okQ = text.includes(q.trim().toLowerCase());
      const okS = status === "all" ? true : j.status === status;
      return okQ && okS;
    });

    const copy = [...filtered];

    if (sort === "company_az") {
      copy.sort((a, b) =>
        (a.company || "").localeCompare(b.company || "", undefined, {
          sensitivity: "base",
        })
      );
      return copy;
    }

    if (sort === "applied_old" || sort === "applied_new") {
      copy.sort((a, b) => {
        const aMs = dateToMs(a.appliedDate) ?? dateToMs(a.createdAt) ?? 0;
        const bMs = dateToMs(b.appliedDate) ?? dateToMs(b.createdAt) ?? 0;
        return sort === "applied_new" ? bMs - aMs : aMs - bMs;
      });
      return copy;
    }

    // priority
    copy.sort((a, b) => {
      const aFollow = dateToMs(a.followUpDate);
      const bFollow = dateToMs(b.followUpDate);

      if (aFollow && bFollow) return aFollow - bFollow;
      if (aFollow && !bFollow) return -1;
      if (!aFollow && bFollow) return 1;

      const aApplied = dateToMs(a.appliedDate);
      const bApplied = dateToMs(b.appliedDate);
      if (aApplied && bApplied) return bApplied - aApplied;
      if (aApplied && !bApplied) return -1;
      if (!aApplied && bApplied) return 1;

      const aCreated = dateToMs(a.createdAt) ?? 0;
      const bCreated = dateToMs(b.createdAt) ?? 0;
      return bCreated - aCreated;
    });

    return copy;
  }, [jobs, q, status, sort]);

  const exportCsv = () => {
    const csv = buildCsv(filteredAndSorted);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;
    const filename = `job-tracker-${stamp}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    setSnack({ open: true, message: "CSV exported" });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
        Applications
      </Typography>
      <Typography sx={{ opacity: 0.75, mb: 2 }}>
        Track your job applications and follow-ups.
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField value={q} onChange={(e) => setQ(e.target.value)} label="Search" fullWidth />

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All</MenuItem>
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 240 }}
        >
          {SORT_OPTIONS.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={exportCsv}
          disabled={filteredAndSorted.length === 0}
          sx={{ px: 2.5 }}
        >
          Export CSV
        </Button>

        <Button component={Link} to="/add" variant="contained" sx={{ px: 3 }}>
          Add Job
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {filteredAndSorted.length === 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              No results
            </Typography>
            <Typography sx={{ opacity: 0.75 }}>
              Add your first application from “Add Job”.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5}>
          {filteredAndSorted.map((j) => (
            <Card key={j.id} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ sm: "center" }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        {j.role}
                      </Typography>

                      <Chip
                        size="small"
                        label={statusLabel(j.status)}
                        color={
                          j.status === "applied"
                            ? "info"
                            : j.status === "interview"
                            ? "warning"
                            : j.status === "offer"
                            ? "success"
                            : "error"
                        }
                      />
                    </Stack>

                    <Typography sx={{ opacity: 0.85, fontWeight: 600 }}>
                      {j.company} {j.location ? `• ${j.location}` : ""}
                    </Typography>

                    <Typography sx={{ opacity: 0.7, mt: 0.5 }}>
                      Applied: {j.appliedDate || "-"}{" "}
                      {j.followUpDate ? `• Follow-up: ${j.followUpDate}` : ""}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
                    {j.link ? (
                      <Button
                        href={j.link}
                        target="_blank"
                        rel="noreferrer"
                        variant="outlined"
                        startIcon={<OpenInNewIcon />}
                      >
                        Link
                      </Button>
                    ) : null}

                    <Button component={Link} to={`/jobs/${j.id}`} variant="contained">
                      Details
                    </Button>

                    <Button
                      onClick={() => askDelete(j)}
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteOutlineIcon />}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={confirm.open} onClose={closeConfirm}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete: <b>{confirm.title}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={1500}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" onClose={closeSnack}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
