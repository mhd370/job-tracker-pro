import * as React from "react";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import { useJobs } from "../context/JobsContext";

export default function StatsPage() {
  const { jobs } = useJobs();

  const counts = React.useMemo(() => {
    const c = { applied: 0, interview: 0, offer: 0, rejected: 0 };
    jobs.forEach((j) => {
      c[j.status] = (c[j.status] || 0) + 1;
    });
    return c;
  }, [jobs]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Stats
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        {Object.entries(counts).map(([k, v]) => (
          <Card key={k} variant="outlined" sx={{ borderRadius: 3, flex: 1 }}>
            <CardContent>
              <Typography sx={{ opacity: 0.7, textTransform: "capitalize" }}>{k}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                {v}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
