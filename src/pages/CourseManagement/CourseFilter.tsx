import React from 'react';
import { Box, Select, MenuItem, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface CourseFilterProps {
  sortOrder: string;
  onSortChange: (event: SelectChangeEvent<string>) => void;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CourseFilter = ({
  sortOrder,
  onSortChange,
  searchTerm,
  onSearchChange,
}: CourseFilterProps) => (
  <Box display="flex" alignItems="center" gap={2} mb={2}>
    <Select value={sortOrder} onChange={onSortChange} size="small">
      <MenuItem value="A-Z">A-Z</MenuItem>
      <MenuItem value="Z-A">Z-A</MenuItem>
    </Select>
    <TextField
      placeholder="Nhập tên khóa học"
      size="small"
      value={searchTerm}
      onChange={onSearchChange}
    />
  </Box>
);

export default CourseFilter;
