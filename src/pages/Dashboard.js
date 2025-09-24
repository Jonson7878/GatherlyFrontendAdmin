  import * as React from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from "@mui/icons-material/Logout";
import BusinessIcon from '@mui/icons-material/Business';
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DiscountIcon from '@mui/icons-material/Discount';
import logo from "../assets/logo.png";
import UserTable from "./tables/UserTable";
import CompanyTable from "./tables/CompanyTable";
import EventTable from "./tables/EventTable";
import OrderTable from "./tables/OrderTable";
import PromoDashboard from "../components/promo/PromoDashboard";

const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "transparent",
  color: "inherit",
  boxShadow: "none",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#e8d5f2",
  backgroundImage: `
    linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(168, 85, 247, 0.05) 25%, rgba(196, 181, 253, 0.1) 50%, rgba(221, 214, 254, 0.05) 75%, rgba(245, 243, 255, 0.1) 100%),
    radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(196, 181, 253, 0.08) 0%, transparent 50%)
  `,
  backgroundSize: "100% 100%, 300px 300px, 250px 250px, 200px 200px",
  backgroundPosition: "0 0, 0 0, 100% 0, 50% 50%",
  boxShadow: "inset -2px 0 10px rgba(147, 51, 234, 0.1), 4px 0 20px rgba(0, 0, 0, 0.05)",
  ...openedMixin(theme),
  "& .MuiDrawer-paper": {
    backgroundColor: "#e8d5f2",
    backgroundImage: `
      linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(168, 85, 247, 0.05) 25%, rgba(196, 181, 253, 0.1) 50%, rgba(221, 214, 254, 0.05) 75%, rgba(245, 243, 255, 0.1) 100%),
      radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(196, 181, 253, 0.08) 0%, transparent 50%)
    `,
    backgroundSize: "100% 100%, 300px 300px, 250px 250px, 200px 200px",
    backgroundPosition: "0 0, 0 0, 100% 0, 50% 50%",
    borderRight: "1px solid rgba(147, 51, 234, 0.2)",
    boxShadow: "inset -2px 0 10px rgba(147, 51, 234, 0.1), 4px 0 20px rgba(0, 0, 0, 0.05)",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
      pointerEvents: "none",
    },
    ...openedMixin(theme),
  },
}));

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "8px",
  margin: "6px 12px",
  transition: "all 0.3s ease",

  "&:hover": {
    backgroundColor: "transparent",
  },

  "&.company-button:hover": {
    backgroundColor: "#f3e5f5",
    color: "#8e24aa",
  },
  "&.company-button:hover .company-icon": {
    color: "#8e24aa",
  },

  "&.users-button:hover": {
    backgroundColor: "#fce4ec",
    color: "#d81b60",
  },
  "&.users-button:hover .users-icon": {
    color: "#d81b60",
  },

  "&.events-button:hover": {
    backgroundColor: "#e0f2f1",
    color: "#00897b",
  },
  "&.events-button:hover .events-icon": {
    color: "#00897b",
  },
  "&.cart-button:hover": {
    backgroundColor: "#e3f2fd", color: "#0d47a1"
  },
  "&.cart-button:hover .cart-icon": { color: "#0d47a1" },
  
  "&.promo-button:hover": {
    backgroundColor: "#e8eaf6",
    color: "#1a237e",
  },
  "&.promo-button:hover .promo-icon": {
    color: "#1a237e",
  },
  "&.logout-button:hover": {
    backgroundColor: "#ffe4e1",
    color: "#d32f2f",
  },
  "&.logout-button:hover .logout-icon": {
    color: "#d32f2f",
  },
}));

export default function MiniDrawer() {
  const navigate = useNavigate();
  const { view } = useParams();
  const open = true;

  React.useEffect(() => {
    if (view) {
      localStorage.setItem("lastDashboardView", view);
    } else {
      const lastView = localStorage.getItem("lastDashboardView") || "company";
      navigate(`/${lastView}/dashboard`, { replace: true });
    }
  }, [view, navigate]);

  // Sidebar is always open; toggling disabled

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderContent = () => {
    if (view === "company") return <CompanyTable />;
    if (view === "users") return <UserTable />;
    if (view === "events") return <EventTable />;
    if (view === "orders") return <OrderTable />;
    if (view === "promos") return <PromoDashboard />;
    const lastView = localStorage.getItem("lastDashboardView") || "company";
    return <Navigate to={`/${lastView}/dashboard`} replace />;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar></Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              fontFamily: "'Pacifico', cursive",
              backgroundColor: "transparent",
              fontWeight:"500",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              fontSize: "1.5rem",
              color: "#993399",
              letterSpacing: "1px",
              userSelect: "none",
              paddingLeft: 0,
              p: 0,
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              style={{ height: 90, objectFit: "contain", display: "block", margin: "0 auto", backgroundColor: "transparent"}}
            />
          </Box>
        </DrawerHeader>
        <Divider sx={{
          my: 1.5,
          height: 2,
          border: 0,
          borderRadius: "999px",
          background: "linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.3) 20%, rgba(168, 85, 247, 0.4) 50%, rgba(147, 51, 234, 0.3) 80%, transparent 100%)",
          opacity: 0.8,
          boxShadow: "0 2px 4px rgba(147, 51, 234, 0.1)"
        }} />
        <List>
        <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/company/dashboard")}
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                margin: "6px 12px",
                fontWeight: 600,
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(147, 51, 234, 0.1)",
                  color: "#7c3aed",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(147, 51, 234, 0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#6a1b9a" }}>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Company" />
            </ListItemButton>
        </ListItem>
          {/* <ListItem disablePadding>
            <CustomListItemButton
              className="company-button"
              onClick={() => navigate("/company/dashboard")}
            >
              <ListItemIcon
                className="company-icon"
                sx={{ color: "#6a1b9a"}}
              >
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText
                primary="Company"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              />
            </CustomListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/users/dashboard")}
              sx={{
                fontFamily: "'Roboto Slab', serif",
                margin: "6px 12px",
                fontWeight: 600,
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                  color: "#8b5cf6",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(168, 85, 247, 0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#c2185b" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <CustomListItemButton
              className="users-button"
              onClick={() => navigate("/users/dashboard")}
            >
              <ListItemIcon
                className="users-icon"
                sx={{ color: "#c2185b" }}
              >
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Users"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              />
            </CustomListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/events/dashboard")}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                margin: "6px 12px",
                fontWeight: 700,
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(196, 181, 253, 0.15)",
                  color: "#6d28d9",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(196, 181, 253, 0.3)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#00695c" }}>
                <EventAvailableTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <CustomListItemButton
              className="events-button"
              onClick={() => navigate("/events/dashboard")}
            >
              <ListItemIcon
                className="events-icon"
                sx={{ color: "#00695c"}}
              >
                <EventAvailableTwoToneIcon />
              </ListItemIcon>
              <ListItemText
                primary="Events"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              />
            </CustomListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/orders/dashboard")}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                margin: "6px 12px",
                fontWeight: 700,
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(221, 214, 254, 0.15)",
                  color: "#5b21b6",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(221, 214, 254, 0.3)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#1565c0" }}>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <CustomListItemButton
              className="cart-button"
              onClick={() => navigate("/orders/dashboard")}
            >
              <ListItemIcon
                className="cart-icon"
                sx={{ color: "#1565c0"}}
              >
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cart"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              />
            </CustomListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/promos/dashboard")}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                margin: "6px 12px",
                fontWeight: 700,
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(221, 214, 254, 0.15)",
                  color: "#5b21b6",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(221, 214, 254, 0.3)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#283593" }}>
                <DiscountIcon />
              </ListItemIcon>
              <ListItemText primary="Promo" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <CustomListItemButton
              className="promo-button"
              onClick={() => navigate("/promos/dashboard")}
            >
              <ListItemIcon
                className="promo-icon"
                sx={{ color: "#283593"}}
              >
                <DiscountIcon />
              </ListItemIcon>
              <ListItemText
                primary="Promo"
                sx={{ textTransform: "capitalize", fontWeight: "600" }}
              />
            </CustomListItemButton>
          </ListItem> */}
        </List>
        <Divider sx={{
          my: 1.5,
          height: 2,
          border: 0,
          borderRadius: "999px",
          background: "linear-gradient(90deg, transparent 0%, rgba(147, 51, 234, 0.3) 20%, rgba(168, 85, 247, 0.4) 50%, rgba(147, 51, 234, 0.3) 80%, transparent 100%)",
          opacity: 0.8,
          boxShadow: "0 2px 4px rgba(147, 51, 234, 0.1)"
        }} />
        <List>
        <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                fontFamily: "'Roboto Slab', serif",
                margin: "6px 12px",
                fontWeight: 600,
                borderRadius: "12px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#dc2626",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#c62828" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
          {/* <ListItem disablePadding>
            <CustomListItemButton className="logout-button" onClick={handleLogout}>
              <ListItemIcon
                className="logout-icon"
                sx={{ color: "#c62828"}}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ fontWeight: "600" }} />
            </CustomListItemButton>
          </ListItem> */}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        <DrawerHeader />
        {renderContent()}
      </Box>
    </Box>
  );
}