import React, { useEffect, useState } from "react";
import {
  Avatar,
  Typography,
  Box,
  Paper,
  Skeleton,
  Container,
  Alert,
  Stack,
} from "@mui/material";
import {
  deepOrange,
  deepPurple,
  teal,
  indigo,
  pink,
  green,
  amber,
  blueGrey,
} from "@mui/material/colors";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const avatarColors = [
  deepOrange[500],
  deepPurple[500],
  teal[500],
  indigo[500],
  pink[500],
  green[500],
  amber[500],
  blueGrey[500],
];

const getInitials = (name) => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  return words.length === 1
    ? words[0][0].toUpperCase()
    : (words[0][0] + words[1][0]).toUpperCase();
};

const UsersList = () => {
  const [groupedUsers, setGroupedUsers] = useState({});
  const [companyColors, setCompanyColors] = useState({});
  const [loading, setLoading] = useState(true); // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [alert,setAlert] = useState({message:'',severity:''})
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // setError("Unauthorized");
        setAlert({message:"You are not authorized. Please Log in", severity:"warning"})
        setLoading(false);
        setTimeout(()=>
        navigate("/login"),1500)
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = response.data.users;

        if (!users || users.length === 0) {
          // setError("No users found.");
          setAlert({message:"No User found.",severity:"error"})
          setLoading(false);
          return;
        }

        const groups = users.reduce((acc, user) => {
          const companyName = user.companyId?.name || "Unknown Company";
          acc[companyName] = acc[companyName] || [];
          acc[companyName].push(user);
          return acc;
        }, {});

        const assignedColors = {};
        Object.keys(groups).forEach((company, index) => {
          assignedColors[company] = avatarColors[index % avatarColors.length];
        });

        setGroupedUsers(groups);
        setCompanyColors(assignedColors);
      } catch (err) {
        if (!err.response) {
          // setError("Failed to fetch");
          setAlert({message:"Error fetching User.", severity:"error"})
        } else if (err.response?.status === 401) {
          // setError("Session expired");
          setAlert({message:"Session is expired.Please log in again.", severity:"warning"})
          localStorage.removeItem("token");
          setTimeout(()=>
          navigate("/login"),1500);
        }
        
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6}}>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 3, fontWeight: "bold", color: "#1976d2", fontFamily: "'Poppins', sans-serif" }}
        >
          Company Users
        </Typography>
        {alert.message && (
          <Stack sx={{ width: '100%', mb: 2 }}>
            <Alert severity={alert.severity} onClose={() => setAlert({ message: '', severity: '' })}>
              {alert.message}
            </Alert>
          </Stack>
        )}

        <Skeleton
          variant="rectangular"
          width={180}
          height={30}
          sx={{ mb: 3, mx: "auto", borderRadius: 1 }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {Array.from(new Array(6)).map((_, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Skeleton variant="circular" width={70} height={70} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={50} />
            </Paper>
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
          Company Users
        </Typography>

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
          No users found.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ maxWidth: "95%", margin: "auto", mt: 4, fontFamily: "'Poppins', sans-serif" }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#1976d2",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Company Users
      </Typography>

      <Box display="flex" flexDirection="column" gap={4}>
        {Object.entries(groupedUsers).map(([companyName, users]) => (
          <Paper key={companyName} elevation={4} sx={{ p: 2, width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                borderBottom: "2px solid #1976d2",
                pb: 1,
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {companyName}
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              {users.map((user) => (
                <Paper
                  key={user._id}
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                  elevation={3}
                >
                  <Avatar
                    sx={{
                      bgcolor: companyColors[companyName] || deepOrange[500],
                      width: 64,
                      height: 64,
                      mb: 1,
                      fontWeight: "bold",
                      fontSize: "1.8rem",
                      color: "#fff",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                      border: "2px solid #fff",
                      transition: "transform 0.3s ease",
                      cursor: "default",
                      userSelect: "none",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    {getInitials(user.username)}
                  </Avatar>

                  <Typography
                    variant="subtitle1"
                    align="center"
                    noWrap
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "1.2rem",
                    }}
                  >
                    {user.username}
                  </Typography>

                  <Typography
                    variant="body2"
                    align="left"
                    sx={{
                      mt: 1,
                      whiteSpace: "pre-line",
                      width: "100%",
                      fontFamily: "'Lora', serif",
                      fontSize: "0.95rem",
                      color: "#333",
                    }}
                  >
                    {`Email: ${user.email}\nRole: ${user.role}\nCompany: ${companyName}`}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default UsersList;
