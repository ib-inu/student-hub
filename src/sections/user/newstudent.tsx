import type { FormEvent, ChangeEvent } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import toast from 'react-hot-toast';
import { useState, useEffect, useCallback } from 'react';
import { doc, query, limit, setDoc, getDocs, orderBy, collection } from 'firebase/firestore';

import { Box, Modal, Button, TextField, Typography, CircularProgress } from '@mui/material';

import { db } from '../../firebase/firebase';

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
    percentage: string;
};

const fieldTypeMap: { [key: string]: string } = {
    name: "text",
    class: "number",
    section: "text",
    rollNumber: "number",
    dateOfBirth: "date",
    address: "text",
    phone: "text",
    email: "email",
    enrolldate: "date",
    percentage: "number"
};
type AddStudentModalProps = {
    open: boolean;
    handleClose: () => void;
    fetchStudents: () => void;
};


const AddStudentModal = ({ open, handleClose, fetchStudents }: AddStudentModalProps) => {
    const [studentData, setStudentData] = useState<StudentData>({
        name: '',
        class: '',
        section: '',
        rollNumber: ''
    });
    const [additionalStudentData, setAdditionalStudentData] = useState<AdditionalStudentData>({
        dateOfBirth: "a",
        address: '',
        phoneNumber: '',
        email: '',
        guardianName: '',
        guardianContact: '',
        enrollmentDate: '',
        percentage: "",
    });

    console.log(additionalStudentData.dateOfBirth);


    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [newId, setNewId] = useState<number | null>(null);

    useEffect(() => {
        const fetchHighestId = async () => {
            const q = query(collection(db, 'students'), orderBy('id', 'desc'), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const highestId = querySnapshot.docs[0].data().id;
                setNewId(+highestId + 1);
            } else {
                setNewId(1);
            }
        };

        if (open) {
            fetchHighestId();
        }
    }, [open]);

    const handleChangeStudentData = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setStudentData((prevData) => ({ ...prevData, [name]: value }));
        },
        []
    );

    const handleChangeAdditionalStudentData = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setAdditionalStudentData((prevData) => ({ ...prevData, [name]: value }));
        },
        []
    );


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!studentData.class || !studentData.name || !studentData.section || !studentData.rollNumber) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsSubmitting(true);

        const stringifiedStudentData = Object.fromEntries(
            Object.entries(studentData).map(([key, value]) => [key, String(value)])
        );

        const stringifiedAdditionalStudentData = Object.fromEntries(
            Object.entries(additionalStudentData).map(([key, value]) => [key, String(value)])
        );

        const combinedData = {
            id: String(newId),
            ...stringifiedStudentData,
            ...stringifiedAdditionalStudentData
        };

        toast.promise(
            setDoc(doc(db, 'students', String(newId)), combinedData)
                .then(() => {
                    handleClose();
                    fetchStudents();
                    setAdditionalStudentData({
                        dateOfBirth: "a",
                        address: '',
                        phoneNumber: '',
                        email: '',
                        guardianName: '',
                        guardianContact: '',
                        enrollmentDate: '',
                        percentage: "",
                    })
                    setStudentData({
                        name: '',
                        class: '',
                        section: '',
                        rollNumber: ''
                    })

                }),
            {
                loading: 'Saving...',
                success: <b>Student added successfully!</b>,
                error: <b>Could not add student.</b>,
            }
        ).finally(() => {
            setIsSubmitting(false);
        });
    };




    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-student-modal-title"
            aria-describedby="add-student-modal-description"
        >
            <Box sx={style}>
                <Typography id="add-student-modal-title" variant="h6" component="h2">
                    Add Student
                </Typography>
                <form onSubmit={handleSubmit}>
                    {Object.keys(studentData).map((field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            type={fieldTypeMap[field] || "text"}
                            value={studentData[field as keyof StudentData]}
                            onChange={handleChangeStudentData}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                    {Object.keys(additionalStudentData).map((field) => (
                        <TextField
                            key={field}
                            type={fieldTypeMap[field] || "text"}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            value={additionalStudentData[field as keyof AdditionalStudentData]}
                            onChange={handleChangeAdditionalStudentData}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 3 }}
                        disabled={newId === null}
                    >

                        {
                            isSubmitting ?
                                <CircularProgress color='secondary' /> :
                                "Submit"
                        }
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AddStudentModal;
