import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useJobs } from "../context/JobsContext";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob } = useJobs();

  const job = jobs.find((j) => j.id === id);

  const [edit, setEdit] = React.useState(null);

  React.useEffect(() => {
    if (job) setEdit(job);
  }, [job]);

  if (!job) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Not Found
          </Typography>
          <Button sx={{ mt: 1 }} variant="contained" onClick={() => navigate("/")}>
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const onChange = (key) => (e) => setEdit((p) => ({ ...p, [key]: e.target.value }));

  const onSave = () => {
    updateJob(id, edit);
    navigate("/");
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Details
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField label="Company" value={edit?.company || ""} onChange={onChange("company")} fullWidth />
              <TextField label="Role" value={edit?.role || ""} onChange={onChange("role")} fullWidth />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField label="Location" value={edit?.location || ""} onChange={onChange("location")} fullWidth />
              <TextField label="Link" value={edit?.link || ""} onChange={onChange("link")} fullWidth />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField select label="Status" value={edit?.status || "applied"} onChange={onChange("status")} fullWidth>
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="date"
                label="Applied Date"
                value={edit?.appliedDate || ""}
                onChange={onChange("appliedDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                label="Follow-up Date"
                value={edit?.followUpDate || ""}
                onChange={onChange("followUpDate")}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <TextField
              label="Notes"
              value={edit?.notes || ""}
              onChange={onChange("notes")}
              multiline
              minRows={3}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button variant="contained" onClick={onSave}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
