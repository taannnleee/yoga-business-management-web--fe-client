import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { createContext, useContext } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  ChartBarSquareIcon,
  CurrencyDollarIcon,
  GiftIcon,
  InboxStackIcon,
  TagIcon,
  UserCircleIcon,
  HomeIcon,           // Icon cho Tổng quan
  AcademicCapIcon,    // Icon cho Quản lý khóa học
} from '@heroicons/react/24/outline';
import UserMenu from '../UserMenu';
import { Link, useRouteMatch } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { useDispatch } from 'react-redux';
import { setOpenSideBar } from '../../redux/slices/auth';

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: open ? drawerWidth : 80, // Thu gọn khi open = false
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface ISideBarProps {
  content: any;
  title: string;
}

export default function MainLayout(props: ISideBarProps) {
  const theme = useTheme();
  const { path } = useRouteMatch();
  const { content, title } = props;
  const { openSideBar: open } = useAppSelector((state: IRootState) => state.auth);

  const dispatch = useDispatch();



  // Tạo state riêng biệt cho mỗi mục
  const [openOverview, setOpenOverview] = useState(false);
  const [openCourseManagement, setOpenCourseManagement] = useState(false);

  const handleOverviewClick = () => {
    setOpenOverview(!openOverview);
  };

  const handleCourseManagementClick = () => {
    setOpenCourseManagement(!openCourseManagement);
  };

  const icons = [

    <ChartBarSquareIcon className="h-6 w-6 text-gray-500" />,
    <UserCircleIcon className="h-6 w-6 text-gray-500" />,
    <TagIcon className="h-6 w-6 text-gray-500" />,
    <InboxStackIcon className="h-6 w-6 text-gray-500" />,
    <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />,

    <HomeIcon className="h-6 w-6 text-gray-500" />,
    <AcademicCapIcon className="h-6 w-6 text-gray-500" />,

  ];

  const activeIcons = [
    <ChartBarSquareIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <UserCircleIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <TagIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <InboxStackIcon className="h-6 w-6 font-semibold text-gray-500" />,
    <BuildingStorefrontIcon className="h-6 w-6 font-semibold text-gray-500" />,
  ];

  const to = [
    '/home',
    '/user-management',
    '/category-management',
    '/products-management',
    '/order-management',
  ];

  const [openSidebar, setOpenSidebar] = useState(true);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };



  // Bổ sung vào trong component

  const location = useLocation();

  // Hàm để kiểm tra xem mục có được chọn hay không
  const isSelected = (path: string) => {
    return location.pathname === path;
  };


  const courseManagementItems = [
    { label: 'Khóa học', url: 'courses' },
    { label: 'Giảng viên', url: 'teachers' },
    { label: 'Chủ đề', url: 'topics' },
  ];

  const overviewManagementItems = [
    { label: 'Báo cáo doanh thu', url: 'dashboard' },
    { label: 'Dự đoán xu hướng', url: 'trend' },

  ];


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={openSidebar} sx={{ backgroundColor: '#4b5563' }}>
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              edge="start"
              onClick={toggleSidebar}
              sx={{
                mr: 2,
                ...(openSidebar && { display: 'none' }), // Hide button when sidebar is open
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={openSidebar}>
        <DrawerHeader sx={{ pl: 4 }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="w-1/3 cursor-pointer text-center text-2xl font-bold text-gray-500 laptop:w-fit">
            YOGA
          </p>
          <IconButton onClick={toggleSidebar}>
            {openSidebar ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Mục Tổng quan */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleOverviewClick}
              sx={{
                justifyContent: 'initial',
                px: 4,
                backgroundColor: isSelected('/home') ? 'blue' : 'transparent',  // Thêm màu nền cho mục được chọn
                '&:hover': {
                  backgroundColor: isSelected('/home') ? 'blue' : 'transparent',  // Thêm hiệu ứng hover
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                <HomeIcon className="h-6 w-6 text-gray-500" /> {/* Icon Tổng quan */}
              </ListItemIcon>
              <ListItemText primary="Tổng quan" />
              {openOverview ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={openOverview} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {overviewManagementItems.map(({ label, url }) => (
                  <ListItemButton
                    key={url}
                    sx={{
                      pl: 8,
                      backgroundColor: isSelected(`/home/${url}`)
                        ? 'blue'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: isSelected(`/home/${url}`)
                          ? 'blue'
                          : 'transparent',
                      },
                    }}
                    component={Link}
                    to={`/home/${url}`}
                  >
                    <ListItemText primary={label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {/* Mục Quản lý khóa học */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleCourseManagementClick}
              sx={{
                justifyContent: 'initial',
                px: 4,
                backgroundColor: isSelected('/course-management') ? 'blue' : 'transparent',  // Thêm màu nền cho mục được chọn
                '&:hover': {
                  backgroundColor: isSelected('/course-management') ? 'blue' : 'transparent',  // Thêm hiệu ứng hover
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                <AcademicCapIcon className="h-6 w-6 text-gray-500" /> {/* Icon Quản lý khóa học */}
              </ListItemIcon>
              <ListItemText primary="Quản lý khóa học" />
              {openCourseManagement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={openCourseManagement} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {courseManagementItems.map(({ label, url }) => (
                  <ListItemButton
                    key={url}
                    sx={{
                      pl: 8,
                      backgroundColor: isSelected(`/course-management/${url}`)
                        ? 'blue'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: isSelected(`/course-management/${url}`)
                          ? 'blue'
                          : 'transparent',
                      },
                    }}
                    component={Link}
                    to={`/course-management/${url}`}
                  >
                    <ListItemText primary={label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>

          {['Quản lý người dùng', 'Quản lý danh mục', 'Quản lý sản phẩm', 'Quản lý đơn hàng'].map((text, index) => (
            <Link to={to[index + 1]} key={text}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    justifyContent: 'initial',
                    px: 4,
                    backgroundColor: isSelected(to[index + 1]) ? 'blue' : 'transparent', // Thêm màu nền cho mục được chọn
                    '&:hover': {
                      backgroundColor: isSelected(to[index + 1]) ? 'blue' : 'transparent', // Thêm hiệu ứng hover
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                    {isSelected(to[index + 1]) ? activeIcons[index + 1] : icons[index + 1]}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {content}
      </Box>
    </Box>
  );
}