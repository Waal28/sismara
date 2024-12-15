"use client";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import SystemLogo from "../atoms/SystemLogo";
import { usePathname, useRouter } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";
import MenuProfileAdmin from "../atoms/MenuProfileAdmin";
import { useAdminState } from "@/context/AdminContext";
import { toast } from "react-toastify";
import { menuAdmin } from "@/constants";
import { Badge } from "@mui/material";
import { getAllMessage } from "@/api/src/pesan";

const drawerWidth = 240;
const baseColor = "#0f766e";
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const DynamicDrawerItem = ({ items, msgNoRead }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.text}
          disablePadding
          className={`${pathname === item.link && "bg-teal-800"} text-white`}
        >
          <ListItemButton onClick={() => router.push(item.link)}>
            <ListItemIcon>
              <Badge
                color="error"
                badgeContent={msgNoRead}
                invisible={item.link !== "/admin/messages"}
              >
                {item.icon}
              </Badge>
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

DynamicDrawerItem.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
  msgNoRead: PropTypes.number.isRequired,
};

export default function LayoutAdmin({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const {
    currentAdmin,
    isAdminLogin,
    updateAdminState,
    msgNoRead,
    refreshDataMsg,
  } = useAdminState();
  const { darkMode } = useDarkMode();
  const isDarkMode = darkMode ? "dark" : "";
  const [open, setOpen] = useState(true);

  async function fetchAllMsg() {
    if (refreshDataMsg === 1) {
      updateAdminState.loadingMsg(true);
    }
    try {
      const response = await getAllMessage();
      console.log(response.data);
      updateAdminState.allMsg(response.data.messages);
      updateAdminState.msgNoRead(response.data.msgNoRead);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan", {
        theme: "colored",
      });
    } finally {
      updateAdminState.loadingMsg(false);
    }
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const checkAdminToken = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");

        if (!adminToken) {
          throw new Error("Token tidak ditemukan, silakan login.");
        }

        // Hanya decode payload, tidak perlu verifikasi di client
        const decoded = jwt.decode(adminToken);
        if (!decoded) {
          throw new Error("Token tidak valid atau rusak.");
        }

        // Cek apakah token sudah expired
        if (decoded.exp * 1000 < Date.now()) {
          throw new Error("Token sudah kedaluwarsa, silakan login lagi.");
        }
        // Update state dengan data admin
        updateAdminState.isAdminLogin(true);
        updateAdminState.currentAdmin(decoded);
      } catch (error) {
        console.error("Token error:", error);
        toast.error(error.message || "Terjadi kesalahan", { theme: "colored" });
        router.replace("/auth/login"); // Redirect dan hapus history
      }
    };

    checkAdminToken(); // Panggil fungsi pengecekan token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // Tambahkan `router` ke dependency array

  useEffect(() => {
    fetchAllMsg();
  }, [refreshDataMsg]);

  return (
    isAdminLogin && (
      <Box sx={{ display: "flex" }} className={isDarkMode}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          style={{ backgroundColor: baseColor }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <div className="flex justify-between w-full">
              <Typography variant="h6" noWrap component="div">
                {currentAdmin.prodi}
              </Typography>
              <MenuProfileAdmin />
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: baseColor,
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <SystemLogo className="w-[9.2rem] h-[9.2rem]" />
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon className="text-white" />
              ) : (
                <ChevronRightIcon className="text-white" />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <DynamicDrawerItem items={menuAdmin.top} msgNoRead={msgNoRead} />
          <Divider />
          {currentAdmin && currentAdmin.isAdmin && (
            <DynamicDrawerItem items={menuAdmin.bottom} msgNoRead={msgNoRead} />
          )}
        </Drawer>
        <Main
          open={open}
          className="min-h-screen bg-white dark:bg-custom-tertiary text-black dark:text-white"
        >
          <DrawerHeader />
          {children}
        </Main>
      </Box>
    )
  );
}

LayoutAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};
