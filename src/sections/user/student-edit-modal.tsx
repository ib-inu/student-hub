import type { FormEvent, ChangeEvent } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { Box, Modal, Button, TextField, Typography, CircularProgress } from '@mui/material';

import { db } from '../../firebase/firebase';

import type { UserProps } from './user-table-row';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: "4px"
};

type StudentData = {
    id: string;
    name: string;
    class: string;
    section: string;
    rollNumber: string;
};

type AdditionalStudentData = {
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    email: string;
    guardianName: string;
    guardianContact: string;
    enrollmentDate: string;
};

type EditStudentModalProps = {
    open: boolean;
    handleClose: () => void;
    studentId: string;
    row: UserProps;
    fetchStudents: () => void;
};

const EditStudentModal = ({ open, handleClose, studentId, row, fetchStudents }: EditStudentModalProps) => {
    const [studentData, setStudentData] = useState<StudentData>({
        id: row.id,
        name: row.name,
        class: row.class,
        section: row.section,
        rollNumber: row.rollNumber
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const docRef = doc(db, "students", studentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as StudentData & AdditionalStudentData;
                    setStudentData({
                        id: data.id,
                        name: data.name,
                        class: data.class,
                        section: data.section,
                        rollNumber: data.rollNumber,
                    });
                }
            } catch (error) {
                console.error("Error fetching student data: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (open && studentId) {
            fetchStudentData();
        }
    }, [open, studentId]);

    const handleChangeStudentData = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setStudentData((prevData) => ({ ...prevData, [name]: value }));
        },
        []
    );


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const combinedData = { ...studentData };

        toast.promise(
            setDoc(doc(db, "students", studentData.id), combinedData)
                .then(() => {
                    handleClose();
                    fetchStudents();
                }),
            {
                loading: 'Saving...',
                success: <b>Student updated successfully!</b>,
                error: <b>Could not update student.</b>,
            }
        ).catch((error) => {
            console.error('Error updating document: ', error);
            toast.error('Failed to update student.');
        });
    };


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-student-modal-title"
            aria-describedby="edit-student-modal-description"
        >
            <Box sx={style}>
                <Typography id="edit-student-modal-title" variant="h6" component="h2">
                    Edit Student
                </Typography>
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        position: 'relative',
                    }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {Object.keys(studentData).map((field) => (
                            field !== "id" && (
                                <TextField
                                    key={field}
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    name={field}
                                    value={studentData[field as keyof StudentData]}
                                    onChange={handleChangeStudentData}
                                    fullWidth
                                    margin="normal"
                                />
                            )
                        ))}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 3 }}
                        >
                            Submit
                        </Button>
                    </form>
                )}
            </Box>
        </Modal>
    );
};

export default EditStudentModal;
