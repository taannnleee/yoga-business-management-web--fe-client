import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import HailIcon from '@mui/icons-material/Hail';

interface SwitchListSecondaryProps {
  initialValues: {
    supportDelivery: boolean;
    supportPickup: boolean;
  };
  onChangeSupportDelivery: (value: boolean) => void;
  onChangeSupportPickup: (value: boolean) => void;
}

const SwitchListSecondary: React.FC<SwitchListSecondaryProps> = ({
  initialValues,
  onChangeSupportDelivery,
  onChangeSupportPickup,
}) => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      subheader={<ListSubheader>Tiện ích</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <DeliveryDiningIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-delivery" primary="Hỗ trợ giao hàng" />
        <Switch
          edge="end"
          onChange={() => onChangeSupportDelivery(!initialValues.supportDelivery)}
          checked={initialValues.supportDelivery}
          inputProps={{
            'aria-labelledby': 'switch-list-label-delivery',
          }}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <HailIcon />
        </ListItemIcon>
        <ListItemText id="switch-list-label-pickup" primary="Hỗ trợ lấy hàng" />
        <Switch
          edge="end"
          onChange={() => onChangeSupportPickup(!initialValues.supportPickup)}
          checked={initialValues.supportPickup}
          inputProps={{
            'aria-labelledby': 'switch-list-label-pickup',
          }}
        />
      </ListItem>
    </List>
  );
};

export default SwitchListSecondary;
