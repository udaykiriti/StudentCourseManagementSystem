import React from 'react';
import './book.css';
import { callApi, errorResponse, getSession } from './main';

const space = { height: '5px' };

export function addCourse() {
    var courseNameInput = document.getElementById('courseNameInput');
    var courseCodeInput = document.getElementById('courseCodeInput');
    var sectionNumberInput = document.getElementById('sectionNumberInput');
    var facultyNameInput = document.getElementById('facultyNameInput');
    var semesterSelect = document.getElementById('semesterSelect');
    var yearSelect = document.getElementById('yearSelect');
    var descriptionInput = document.getElementById('descriptionInput');

    courseNameInput.style.border="";
    courseCodeInput.style.border="";
    sectionNumberInput.style.border="";
    facultyNameInput.style.border="";
    semesterSelect.style.border="";
    yearSelect.style.border="";
    descriptionInput.style.border="";

    if (
        courseNameInput.value === "" ||
        courseCodeInput.value === "" ||
        sectionNumberInput.value === "" ||
        facultyNameInput.value === "" ||
        semesterSelect.value === "" ||
        yearSelect.value === "" ||
        descriptionInput.value === ""
    ) {
        alert("All fields are required.");
        return;
    }

    var url = "http://localhost:5000/book/addnewcourse";
    var data = JSON.stringify({
        courseName: courseNameInput.value,
        courseCode: courseCodeInput.value,
        sectionNumber: sectionNumberInput.value,
        facultyName: facultyNameInput.value,
        semester: semesterSelect.value,
        year: yearSelect.value,
        description: descriptionInput.value
    });

    callApi("POST", url, data, submitSuccess, errorResponse);
    courseNameInput.value="";
    courseCodeInput.value="";
    sectionNumberInput.value="";
    facultyNameInput.value="";
    semesterSelect.value="";
    yearSelect.value="";
    descriptionInput.value="";
}

function submitSuccess(res) {
    var data = JSON.parse(res);
    if (data.error) {
        if (data.error.includes("courseCode")) {
            alert("Course code already exists.");
        } else if (data.error.includes("courseName")) {
            alert("Course name already exists.");
        } else {
            alert("Course Name or Course Code exists "); // Display the general error message
        }
    } else {
        alert("Course added successfully.");
    }
}

class Book extends React.Component {
    constructor() {
        super();
        this.sid = getSession('sid');
        if (this.sid === '') window.location.replace('/');
    }

    render() {
        const academicYears = Array.from({length: 10}, (_, index) => {
            const startYear = new Date().getFullYear() - index;
            const endYear = startYear + 1;
            return `${startYear}-${endYear}`;
        });

        return (
            <div className='full-height'>
                <div className='bookcontent'>
                    <div style={space}></div>
                    <div className='input-container'>
                        <div className='input-row'>
                            <div className='input-label'>Course Name</div>
                            <input type='text' id='courseNameInput' className='txtbox1' />
                        </div>
                        <div className='input-row'>
                            <div className='input-label'>Course Code</div>
                            <input type='text' id='courseCodeInput' className='txtbox1' />
                        </div>
                        <div className='input-row'>
                            <div className='input-label'>Section number</div>
                            <input type='text' id='sectionNumberInput' className='txtbox1' />
                        </div>
                        <div className='input-row'>
                            <div className='input-label'>Faculty Name</div>
                            <input type='text' id='facultyNameInput' className='txtbox1' />
                        </div>
                        <div className='input-row'>
                            <div className='input-label'>Select Semester</div>
                            <select id='semesterSelect' className='txtbox1'>
                                <option value=''>Select Semester</option>
                                <option value='Odd'>Odd</option>
                                <option value='Even'>Even</option>
                            </select>
                        </div>
                        <div className='input-row'>
                            <div className='input-label'>Select Academic Year</div>
                            <select id='yearSelect' className='txtbox1'>
                                <option value=''>Select Year</option>
                                {academicYears.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                        <div className='input-row'>
                            <div className='input-label'>Description</div>
                            <textarea id='descriptionInput' className='description-input' rows='4'></textarea>
                        </div>
                    </div>
                    <div style={space}></div>
                    <div style={space}></div>
                    <div className='btn1' onClick={addCourse}>Submit</div>
                </div>
            </div>
        );
    }
}

export default Book;
