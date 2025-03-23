import React from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../redux/auth/authSlice"; // Assuming you have a logout action
import { toast } from "react-toastify";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4777/api/users/logout", {}, { withCredentials: true });
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
    handleMenuClose();
  };

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "#ffffff",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Blockchain Voting
        </Typography>
      </Toolbar>
      <List>
        {/* Always visible links */}
        <ListItem
          component={Link}
          to="/"
          button
          selected={location.pathname === "/"}
          sx={{
            color: "white",
            "&.Mui-selected": {
              backgroundColor: "#ff5722",
              color: "#ffffff",
            },
            "&:hover": {
              backgroundColor: "#333547",
            },
          }}
        >
          <ListItemText primary="Home" />
        </ListItem>
        {!userInfo && (
  <ListItem
    component={Link}
    to="/login"
    button
    selected={location.pathname === "/login"}
    sx={{
      color: "white",
      "&.Mui-selected": {
        backgroundColor: "#ff5722",
        color: "#ffffff",
      },
      "&:hover": {
        backgroundColor: "#333547",
      },
    }}
  >
    <ListItemText primary="Login" />
  </ListItem>
)}

        <ListItem
          component={Link}
          to="/results"
          button
          selected={location.pathname === "/results"}
          sx={{
            color: "white",
            "&.Mui-selected": {
              backgroundColor: "#ff5722",
              color: "#ffffff",
            },
            "&:hover": {
              backgroundColor: "#333547",
            },
          }}
        >
          <ListItemText primary="Voting Results" />
        </ListItem>
        {userInfo && (
          <>
            <ListItem
              component={Link}
              to="/face"
              button
              selected={location.pathname === "/face"}
              sx={{
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "#ff5722",
                  color: "#ffffff",
                },
                "&:hover": {
                  backgroundColor: "#333547",
                },
              }}
            >
              <ListItemText primary="Cast Votes" />
            </ListItem>
            {/* <ListItem
              component={Link}
              to="/voters"
              button
              selected={location.pathname === "/voters"}
              sx={{
                color: "white",
                "&.Mui-selected": {
                  backgroundColor: "#ff5722",
                  color: "#ffffff",
                },
                "&:hover": {
                  backgroundColor: "#333547",
                },
              }}
            >
              <ListItemText primary="Manage Voters" />
            </ListItem> */}
            {userInfo.isAdmin && (
              <>
              <ListItem
                component={Link}
                to="/election"
                button
                selected={location.pathname === "/election"}
                sx={{
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "#ff5722",
                    color: "#ffffff",
                  },
                  "&:hover": {
                    backgroundColor: "#333547",
                  },
                }}
              >
                <ListItemText primary="Start Election" />
              </ListItem>
              <ListItem
                component={Link}
                to="/candidates"
                button
                selected={location.pathname === "/candidates"}
                sx={{
                  color: "white",
                  "&.Mui-selected": {
                    backgroundColor: "#ff5722",
                    color: "#ffffff",
                  },
                  "&:hover": {
                    backgroundColor: "#333547",
                  },
                }}
              >
                <ListItemText primary="Manage Candidates" />
              </ListItem>
              </>
            )}
          </>
        )}
      </List>
      {/* User Avatar and Dropdown */}
      {userInfo && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            alt={userInfo.name || "User"}
            src="/static/images/avatar-placeholder.png" // Replace with user profile picture URL if available
          />
          <Box>
            <Typography variant="body1">{userInfo.name}</Typography>
            <Typography variant="body2">{userInfo.email}</Typography>
          </Box>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ color: "white", ml: "auto" }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Drawer>
  );
};

export default Navbar;
