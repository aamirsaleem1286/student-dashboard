"use client"
import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/utlis/firebaseConfig';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchStudentsFromFirebase = async () => {
      try {
        const studentCollectionRef = collection(db, 'students');
        const querySnapshot = await getDocs(studentCollectionRef);

        const studentList = [];
        querySnapshot.forEach((doc) => {
          studentList.push({ id: doc.id, ...doc.data(), isEditing: false });
        });
        setStudents(studentList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error("Error fetching students!");
      }
    };

    fetchStudentsFromFirebase();
  }, []);


//add student to firebase
  const handleAddStudent = async (data) => {
    try {
      const studentCollectionRef = collection(db, 'students');
      await addDoc(studentCollectionRef, data);
      console.log('Student added successfully!');
      setStudents([...students, { ...data, isEditing: false }]);
    
    setTimeout(() => {
      window.location.reload();
    }, 4000);
    

      toast.success("Student added successfully!");
      reset();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error("Error adding student!");
    }
  };

  //add student editing
  const handleEditSubmit = async (studentId) => {
    try {
      const name = students.find((student) => student.id === studentId).nameRef.value;
      const email = students.find((student) => student.id === studentId).emailRef.value;
      const universityName = students.find((student) => student.id === studentId).universityNameRef.value;
      const department = students.find((student) => student.id === studentId).departmentRef.value;
      const currentSemester = students.find((student) => student.id === studentId).currentSemesterRef.value;
  
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, { name, email, universityName, department, currentSemester }); 
  
      setStudents(students.map((student) => {
        if (student.id === studentId) {
          return { ...student, name, email, universityName, department, currentSemester, isEditing: false };
        }
        return student;
      }));
  
      console.log('Student updated successfully!');
      toast.success("Student updated successfully!");
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error("Error updating student!");
    }
  };

  //add student delete functionality
  const handleDelete = async (studentId) => {
    try {
      const studentRef = doc(db, 'students', studentId);
      await deleteDoc(studentRef);
      setStudents(students.filter((student) => student.id !== studentId));
      console.log('Student deleted successfully!');
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error("Error deleting student!");
    }
  };

  const toggleEdit = (studentId) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return { ...student, isEditing: !student.isEditing };
      }
      return student;
    }));
  };

  // Function to handle CSV file upload
  const handleCSVUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const data = text.split('\n').map(line => {
        const [name, email, universityName, department, currentSemester] = line.split(',');
        return { name, email, universityName, department, currentSemester };
      });

      try {
        const studentCollectionRef = collection(db, 'students');
        await Promise.all(data.map(async (student) => {
          await addDoc(studentCollectionRef, student);
        }));
        toast.success("Students added successfully from CSV!");
        window.location.reload(); 
      } catch (error) {
        console.error('Error adding students from CSV:', error);
        toast.success("Students added successfully from CSV!");
//        toast.error("Error adding students from CSV!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto ">
      {loading && (
   <div class="flex justify-center items-center h-screen">
   <div class="w-24 h-24 border-4 border-white border-solid rounded-full animate-spin border-t-orange-500"></div>
   <p class="text-white ml-4">Loading...</p>
 </div>
 
 
      )}

      {!loading && (
        <>
          <form onSubmit={handleSubmit(handleAddStudent)} className="mb-4">
            <div className="flex space-x-2 px-4 py-4">
              <div className="w-full">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border bg-slate-200 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('name', { required: true })}
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
              </div>
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border bg-slate-200 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('email', { required: true })}
                  placeholder="johndoe@example.com"
                />
                {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
              </div>
              <div className="w-full">
                <label htmlFor="universityName" className="block text-sm font-medium mb-1">
                  University Name
                </label>
                <input
                  type="text"
                  id="universityName"
                  className="w-full px-3 py-2 border bg-slate-200 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('universityName', { required: true })}
                  placeholder="University Name"
                />
                {errors.universityName && <span className="text-red-500 text-sm">University Name is required</span>}
              </div>
              <div className="w-full">
                <label htmlFor="department" className="block text-sm font-medium mb-1">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  className="w-full px-3 py-2 border border-gray-300 bg-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('department', { required: true })}
                  placeholder="Department"
                />
                {errors.department && <span className="text-red-500 text-sm">Department is required</span>}
              </div>
              <div className="w-full">
                <label htmlFor="currentSemester" className="block text-sm font-medium mb-1">
                  Current Semester
                </label>
                <input
                  type="text"
                  id="currentSemester"
                  className="w-full px-3 py-2 border border-gray-300 bg-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  {...register('currentSemester', { required: true })}
                  placeholder="Current Semester"
                />
                {errors.currentSemester && <span className="text-red-500 text-sm">Current Semester is required</span>}
              </div>
              <button
              style={{
                  width: "100px",marginTop: "18px",height: "46px"}}
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
              >
                Add Student
              </button>
            </div>
          </form>
          {/* // another component to take input user of csv file  */}
          <div className="px-4 py-2">
            <label htmlFor="csvFile" className="block text-sm font-medium mb-1">
              Upload Students CSV
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              className="border border-gray-300 rounded-md p-2 text-white"
              onChange={handleCSVUpload}
            />
          </div>
{/* table data to show student detail */}

          <table className="table-auto w-full mt-4 bg-black text-white border border-white">
  <thead>
    <tr>
      <th className="px-4 py-2 text-left border border-white "style={{backgroundColor: "cornflowerblue"}}>Name</th>
      <th className="px-4 py-2 text-left border border-white"style={{backgroundColor: "cornflowerblue"}}>Email</th>
      <th className="px-4 py-2 text-left border border-white" style={{backgroundColor: "cornflowerblue"}}>University</th>
      <th className="px-4 py-2 text-left border border-white" style={{backgroundColor: "cornflowerblue"}}>Department</th>
      <th className="px-4 py-2 text-left border border-white" style={{backgroundColor: "cornflowerblue"}}>Current Semester</th>
      <th className="px-4 py-2 text-left border border-white" style={{backgroundColor: "cornflowerblue"}}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {students.map((student) => (
      <tr key={student.id} className="border-b border-gray-300 hover:bg-gray-100 hover:text-black">
        <td className="px-4 py-2 border border-white">
          {student.isEditing ? (
            <input
              type="text"
              id={`name_${student.id}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              defaultValue={student.name}
              ref={(input) => (student.nameRef = input)} // Create a ref for the input field
            />
          ) : (
            student.name
          )}
        </td>
        <td className="px-4 py-2 border border-white">
          {student.isEditing ? (
            <input
              type="email"
              id={`email_${student.id}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              defaultValue={student.email}
              ref={(input) => (student.emailRef = input)} // Create a ref for the input field
            />
          ) : (
            student.email
          )}
        </td>
        <td className="px-4 py-2 border border-white">
          {student.isEditing ? (
            <input
              type="text"
              id={`universityName_${student.id}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              defaultValue={student.universityName}
              ref={(input) => (student.universityNameRef = input)} 
            />
          ) : (
            student.universityName
          )}
        </td>
        <td className="px-4 py-2 border border-white">
          {student.isEditing ? (
            <input
              type="text"
              id={`department_${student.id}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              defaultValue={student.department}
              ref={(input) => (student.departmentRef = input)} 
            />
          ) : (
            student.department
          )}
        </td>
        <td className="px-4 py-2 border border-white">
          {student.isEditing ? (
            <input
              type="text"
              id={`currentSemester_${student.id}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              defaultValue={student.currentSemester}
              ref={(input) => (student.currentSemesterRef = input)} 
            />
          ) : (
            student.currentSemester
          )}
        </td>
        <td className="px-4 py-2 border border-white">
          {student.isEditing ? (
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEditSubmit(student.id)}
            >
              Save
            </button>
          ) : (
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => toggleEdit(student.id)}
            >
              <FaEdit className="h-5 w-5 inline-block" /> Edit
            </button>
          )}
          <button
            className="ml-4 text-red-500 hover:text-red-700"
            onClick={() => handleDelete(student.id)}
          >
            <MdDelete className="h-5 w-5 inline-block" /> Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </>
      )}

      {/* Display message if no students are found */}
      {!loading && students.length === 0 && (
        <p className="text-center text-white">No students found</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default Students;
