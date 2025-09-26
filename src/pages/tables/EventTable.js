import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Chip,
  Divider,
  Skeleton,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Stack,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from "@mui/icons-material/Sort";
import API_BASE from '../../config/api';

const EventCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "350px",
  height: "100%",
  borderRadius: "14px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  overflow: "hidden",
  cursor: "pointer",
  backgroundColor: "#fff",
  transition: "transform 0.35s ease, box-shadow 0.35s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 12px 25px rgba(1, 59, 250, 0.29)",
  },
}));

const StyledMenu = styled((props) => (
  <Menu
    elevation={8}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.87)"
        : theme.palette.grey[300],
    boxShadow:
      "0px 10px 20px rgba(0,0,0,0.12), 0px 3px 6px rgba(0,0,0,0.05)",

    "& .MuiMenu-list": {
      padding: "8px 0",
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: 8,
  margin: "4px 12px",
  transition: "background-color 0.3s ease, color 0.3s ease",
  fontWeight: 600,

  "&:hover, &.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: "#ffccbc", 
    // color: "#000",               
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  },

  "&.Mui-focusVisible": {
    backgroundColor: "#f4511e",
    color: "#fff",
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  },
}));

export default function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: '', severity: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectedCompany, setSelectedCompany] = useState("All Companies");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // setError("Unauthorized: Please log in first.");
          setAlert({message:"You are not authorized. Please Log in",severity:"warning"})
          setTimeout(()=>
          navigate("/login"),1500
          )
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE}/api/events/AllEvent`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          // setError("Session expired. Please log in again.");
          setAlert({message:"Session expired. Please log in again.",severity:"warning"})
          setTimeout(()=>
          navigate("/login"),1500)
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }

        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        // setError(err.message || "Failed to fetch events.");
        setAlert({message: err.response?.data?.message || "Error fetching events", severity:"error"})
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const skeletonArray = new Array(6).fill(null);

  const uniqueCompanies = Array.from(
    new Set(
      events
        .filter((e) => e.createdBy.companyId && e.createdBy.companyId.name)
        .map((e) => e.createdBy.companyId.name)
    )
  );

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleCompanySelect = (companyName) => {
    setSelectedCompany(companyName);
    handleSortClose();
  };

  const filteredEvents =
    selectedCompany === "All Companies"
      ? events
      : events.filter(
          (e) =>
            e.createdBy?.companyId?.name &&
            e.createdBy.companyId.name === selectedCompany
        );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, minHeight: "100vh" }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 5,
            fontWeight: "bold",
            color: "#1976d2",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          All Events
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          {skeletonArray.map((_, index) => (
            <EventCard key={index}>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <CardContent>
                <Skeleton height={30} width="80%" />
                <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
                <Skeleton height={20} width="40%" sx={{ mt: 1 }} />
                <Skeleton height={20} width="90%" sx={{ mt: 2 }} />
              </CardContent>
            </EventCard>
          ))}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#1976d2",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          All Events
        </Typography>
        {alert.message && (
          <Stack sx={{ width: '100%', mb: 2 }}>
            <Alert severity={alert.severity} onClose={() => setAlert({ message: '', severity: '' })}>
              {alert.message}
            </Alert>
          </Stack>
        )}

        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "error.main",
            fontFamily: "'Lora', serif",
            mb: 1,
          }}
        >
          {error}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            fontStyle: "italic",
            fontFamily: "'Lora', serif",
            color: "#888",
          }}
        >
          No events found.
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          mb: 1,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            textAlign: "center",
            gridColumn: "2 / 3",
          }}
        >
          All Events
        </Typography>

        <IconButton
          color="primary"
          aria-label="sort events"
          onClick={handleSortClick}
          aria-controls={open ? "company-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ gridColumn: "3 / 4", justifySelf: "end" }}
        >
          <SortIcon />
        </IconButton>

        <StyledMenu
          id="company-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleSortClose}
          MenuListProps={{
            "aria-labelledby": "sort-button",
          }}
        >
          <StyledMenuItem
            selected={selectedCompany === "All Companies"}
            onClick={() => handleCompanySelect("All Companies")}
          >
            All Companies
          </StyledMenuItem>

          {uniqueCompanies.length > 0 ? (
            uniqueCompanies.map((company) => (
              <StyledMenuItem
                key={company}
                selected={selectedCompany === company}
                onClick={() => handleCompanySelect(company)}
              >
                {company}
              </StyledMenuItem>
            ))
          ) : (
            <StyledMenuItem disabled>No companies</StyledMenuItem>
          )}
        </StyledMenu>
      </Box>

    {selectedCompany !== "All Companies" && (
      <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              color: "#222",
            }}
        >
        Showing events for
        <Box
          component="span"
          sx={{
           //  backgroundColor: "#e3f2fd",
            color: "#dd2c00",
            px: 1.5,
            py: 0.5,
            borderRadius: "8px",
            fontWeight: 700,
            display: "inline-block",
            fontSize: "1.2rem",
          }}
        >
          {selectedCompany}
        </Box>
      </Typography>
    )}

      {filteredEvents.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
            mt: 3,
          }}
        >
          {filteredEvents.map((event, index) => (
            <Fade in={true} timeout={400 + index * 200} key={event._id}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <EventCard onClick={() => navigate(`/event/${event._id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      event.image?.startsWith("data:image")
                        ? event.image
                        : "/path-to-default-image.jpg"
                    }
                    alt={event.eventName}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {event.eventName}
                    </Typography>

                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}
                    >
                      <Chip
                        icon={<EventIcon />}
                        label={new Date(event.dateTime).toLocaleString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                        sx={{
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: "600",
                          boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)",
                          "& .MuiSvgIcon-root": { color: "#1976d2" },
                          borderRadius: "8px",
                        }}
                      />
                      <Chip
                        icon={<LocationOnIcon />}
                        label={event.location}
                        sx={{
                          bgcolor: "#fce4ec",
                          color: "#d81b60",
                          fontWeight: "600",
                          boxShadow: "0 2px 6px rgba(216, 27, 96, 0.3)",
                          "& .MuiSvgIcon-root": { color: "#d81b60" },
                          borderRadius: "8px",
                        }}
                      />
                      <Chip
                        icon={<VisibilityIcon />}
                        label={(event.view.toUpperCase())}
                        sx={{
                          bgcolor: "#f3e5f5",
                          color: "#8e24aa",
                          fontWeight: "600",
                          boxShadow: "0 2px 6px rgba(158, 25, 210, 0.43)",
                          "& .MuiSvgIcon-root": { color: "#8e24aa" },
                          borderRadius: "8px",
                        }}
                      />

                    </Box>

                    <Divider sx={{ my: 1, opacity: 0.3 }} />
                    {event.createdBy && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1, fontWeight: 500 }}
                      >
                        Created by: <b>{event.createdBy.username}</b>
                        {event.createdBy.companyId?.name && (
                          <>
                            {" "}
                            | Company:{" "}
                            <strong>{event.createdBy.companyId.name.toUpperCase()}</strong>
                          </>
                        )}
                      </Typography>
                    )}
                  </CardContent>
                </EventCard>
              </Box>
            </Fade>
          ))}
        </Box>
      ) : (
        <Typography
          align="center"
          sx={{
            mt: 5,
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#999",
            textShadow: "0 0 3px rgba(0,0,0,0.1)",
          }}
        >
          No events found.
        </Typography>
      )}
    </Box>
  );
}