import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { db } from 'src/firebase/firebase';

import { Iconify } from 'src/components/iconify';

import EditStudentModal from './student-edit-modal';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
};

type UserTableRowProps = {
  row: UserProps;
  fetchStudents: () => void;
};

export function UserTableRow({ row, fetchStudents }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleOpenEditModal = useCallback(() => {
    setOpenPopover(null);
    setIsEditModalOpen(true);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);


  const deleteStudent = async (studentId: string) => {
    setOpenPopover(null);

    toast.promise(
      deleteDoc(doc(db, 'students', studentId))
        .then(() => {
          fetchStudents();
          console.log('Student successfully deleted!');
        }),
      {
        loading: 'Deleting...',
        success: <b>Student deleted successfully!</b>,
        error: <b>Could not delete student.</b>,
      }
    );
  };


  return (
    <>
      <TableRow hover tabIndex={-1}>
        <EditStudentModal
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          studentId={row.id}
          row={row}
          fetchStudents={fetchStudents}
        />

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.id}
          </Box>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            {row.name}
          </Box>
        </TableCell>
        <TableCell>{row.class}</TableCell>
        <TableCell>{row.section}</TableCell>
        <TableCell align="center">{row.rollNumber}</TableCell>
        <TableCell align="left">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
          <MenuItem onClick={handleOpenEditModal}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => deleteStudent(row.id)} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
