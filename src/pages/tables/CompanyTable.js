import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Stack,
  Chip,
  Button,
  Backdrop,
  Paper,
  Divider,
  Container,
  Alert,
  IconButton,
  TextField,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import API_BASE from '../../config/api';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);  // eslint-disable-next-line
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAlert({ message: "You are not authorized. Please Log in.", severity: "warning" });
          setTimeout(() => navigate("/login"), 1500);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/company/companies`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          setAlert({ message: "Session expired. Please log in again.", severity: "warning" });
          setTimeout(() => navigate("/login"), 1500);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();

        if (data.status) {
          setCompanies(data.companies);
        } else {
          throw new Error("Failed to load companies");
        }
      } catch (err) {
        setAlert({ message: err.message || "Error fetching companies", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  const handleDeleteCompany = async (companyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company and all its data?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert({ message: "Unauthorized. Please log in.", severity: "warning" });
        return;
      }

      const res = await fetch(`${API_BASE}/api/company/${companyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Failed to delete company");
      }

      setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      setAlert({ message: "Company deleted successfully.", severity: "success" });
    } catch (error) {
      console.error("Delete error:", error);
      setAlert({ message: error.message || "Error deleting company", severity: "error" });
    }
  };

  const handleOpenBackdrop = (company, action) => {
    setSelectedCompany({ ...company, action });
    setOpenBackdrop(true);
  };

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
    setSelectedCompany(null);
  };

 const handleUpdateCompany = async () => {
  setIsUpdating(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/company/update/${selectedCompany._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: selectedCompany.name,
        type: selectedCompany.type,
        description: selectedCompany.description,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.message || "Update failed");
    }

    setAlert({ message: "Company updated successfully", severity: "success" });
    setTimeout (()=> setAlert({message:"",severity:""}),1500)
    setOpenBackdrop(false);

    setCompanies((prev) =>
      prev.map((c) =>
        c._id === selectedCompany._id
          ? {
              ...c,
              name: selectedCompany.name,
              type: selectedCompany.type,
              description: selectedCompany.description,
            }
          : c
      )
    );
  } catch (err) {
    setAlert({ message: err.message, severity: "error" });
  } finally {
    setIsUpdating(false);
  }
};


  const renderCompanyGrid = () => (
    <Grid container columns={12} columnSpacing={4} rowSpacing={4}>
      {companies.map((company) => (
        <Grid
          key={company._id}
          sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 4" } }}
        >
          <Card
            elevation={4}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow:
                "0 4px 12px rgba(25, 118, 210, 0.15), 0 2px 8px rgba(25, 118, 210, 0.10)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              bgcolor: "background.paper",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow:
                  "0 8px 24px rgba(25, 118, 210, 0.3), 0 4px 12px rgba(25, 118, 210, 0.2)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: "primary.main", width: 48, height: 48, fontSize: "1.8rem" }}
                >
                  <BusinessIcon fontSize="inherit" />
                </Avatar>
              }
              title={
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Poetsen One', cursive",
                    fontSize: "1.5rem",
                    color: "#0d47a1",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {company.name}
                </Typography>
              }
              subheader={
                <Chip
                  label={company.type}
                  color="secondary"
                  size="small"
                  sx={{
                    fontWeight: "500",
                    fontStyle: "italic",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                />
              }
              sx={{ pb: 0 }}
            />

            <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  minHeight: "30px",
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "1.1rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {company.description || "No description provided."}
              </Typography>
            </CardContent>

            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ p: 1, pt: 0 }}>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "60px",
                  padding: "4px 16px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  borderColor:"#5c6bc0",
                  color:"#303f9f",
                  "&:hover": {
                    backgroundColor: "#303f9f",
                    borderColor:"#303f9f",
                    color: "#fff",
                  },
                }}
                onClick={() => handleOpenBackdrop(company, "view")}
              >
                View Details
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="secondary"
                sx={{
                  textTransform: "none",
                  borderRadius: "50px",
                  padding: "4px 16px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    color: "#fff",
                  },
                }}
                onClick={() => handleOpenBackdrop(company, "contact")}
              >
                Contact
              </Button>

              {/* EDIT BUTTON ADDED HERE */}
              <Button
                variant="outlined"
                size="small"
                color="info"
                sx={{
                  textTransform: "none",
                  borderRadius: "50px",
                  padding: "4px 16px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "info.main",
                    color: "#fff",
                  },
                }}
                onClick={() => handleOpenBackdrop(company, "edit")}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  borderRadius: "50px",
                  padding: "4px 16px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  borderColor: "#ec407a",
                  color: "#c2185b",
                  "&:hover": {
                    backgroundColor: "#c2185b",
                    borderColor: "#c2185b",
                    color: "#fff",
                  },
                }}
                onClick={() => handleDeleteCompany(company._id)}
              >
                Remove
              </Button>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 3,
          color: "#1976d2",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Companies List
      </Typography>

      {alert.message && (
        <Stack sx={{ width: "100%", mb: 2 }}>
          <Alert
            severity={alert.severity}
            onClose={() => setAlert({ message: "", severity: "" })}
          >
            {alert.message}
          </Alert>
        </Stack>
      )}

      {loading ? (
        <Typography variant="body1" align="center">
          Loading...
        </Typography>
      ) : error ? (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      ) : companies.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No companies available.
        </Typography>
      ) : (
        renderCompanyGrid()
      )}

      {/* BACKDROP FOR VIEW, CONTACT, EDIT */}
      <Backdrop
        open={openBackdrop}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          overflowY: "auto",
          p: 2,
        }}
        onClick={handleCloseBackdrop}
      >
        <Paper
          onClick={(e) => e.stopPropagation()}
          sx={{
            maxWidth: 480,
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            p: 4,
            borderRadius: 3,
            position: "relative",
          }}
          elevation={6}
        >
          <IconButton
            onClick={handleCloseBackdrop}
            sx={{ position: "absolute", top: 8, right: 8 }}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>

          {selectedCompany && (
            <>
              {selectedCompany.action === "edit" ? (
                <Stack spacing={2}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    textAlign="center"
                    color="primary"
                  >
                    Revise Company Info.
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Typography
                        component="label"
                        htmlFor="company-name"
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ minWidth: 120 }}
                      >
                        Company Name:
                      </Typography>
                      <TextField
                        id="company-name"
                        value={selectedCompany.name}
                        onChange={(e) =>
                          setSelectedCompany({ ...selectedCompany, name: e.target.value })
                        }
                        size="small"
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Typography
                        component="label"
                        htmlFor="company-type"
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ minWidth: 120 }}
                      >
                        Company Type:
                      </Typography>
                      <TextField
                        id="company-type"
                        value={selectedCompany.type}
                        onChange={(e) =>
                          setSelectedCompany({ ...selectedCompany, type: e.target.value })
                        }
                        size="small"
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                    </Box>

                    <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                      <Typography
                        component="label"
                        htmlFor="company-description"
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ minWidth: 120, pt: '8px' }}
                      >
                        Description:
                      </Typography>
                      <TextField
                        id="company-description"
                        value={selectedCompany.description}
                        onChange={(e) =>
                          setSelectedCompany({ ...selectedCompany, description: e.target.value })
                        }
                        multiline
                        rows={3}
                        size="small"
                        variant="outlined"
                        sx={{ flex: 1 }}
                      />
                    </Box>

                  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button 
                       variant="outlined"
                       size="small"
                       sx={{
                          textTransform:"none",
                          borderRadius:"10px",
                          padding:"4px 16px",
                          fontWeight:"600",
                          fontSize: "0.85rem",
                          borderColor: "#607d8b",
                          color:"#263238",
                          "&:hover":{
                            backgroundColor:"#546e7a",
                            borderColor:"#455a64",
                            color:"#fff"
                          }
                       }}
                      onClick={handleCloseBackdrop}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="info"
                      disabled={isUpdating}
                      sx={{
                        textTransform: "none",
                        borderRadius: "10px",
                        padding: "4px 16px",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        "&:hover": {
                          backgroundColor: "info.dark",
                          color: "#fff",
                        },
                      }}
                      onClick={handleUpdateCompany}
                    >
                      {isUpdating ? "Updating..." : "Update"}
                    </Button>

                  </Stack>
                </Stack>
              ) : selectedCompany.action === "view" ? (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {selectedCompany.name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> {selectedCompany.type}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong>{" "}
                    {selectedCompany.description || "No description provided."}
                  </Typography>
                </>
              ) : selectedCompany.action === "contact" ? (
                <>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Contact Information
                  </Typography>
                  <Typography>
                    <strong>Email:</strong>{" "}
                    info@{selectedCompany.name?.toLowerCase().replace(/\s/g, "")}.com
                  </Typography>
                </>
              ) : null}
            </>
          )}
        </Paper>
      </Backdrop>
    </Container>
  );
}
