import React from 'react';
import './home.css';
import logouticon from './images/logout.png';
import { callApi, errorResponse, getSession, setSession } from './main';
import menuicon from './images/menu.png';

const HS1 = {"padding-left" : "5px", "font-weight" : "bold"};
const HS2 = {"float" : "right", "padding-right" : "5px", "cursor" : "pointer"};
const HS3 = {"float" : "right", "height" : "16px", "margin-top" : "6px", "cursor" : "pointer"};
const HS4 = {"float" : "right", "padding-right" : "10px"};

export function loadFMenu(res) {
    var data = JSON.parse(res);
    var fmenuitems = "";
    for(var x in data) {
        fmenuitems += `<li>
                        <label id='${data[x].mid}L' >${data[x].mtitle}</label>
                        <div id='${data[x].mid}' class='fmenu'></div>
                      </li>`;
    }
    var mlist = document.getElementById('mlist');
    mlist.innerHTML = fmenuitems;

    for(x in data) {
        document.getElementById(`${data[x].mid}L`).addEventListener("click", showFMenu.bind(null, data[x].mid));
    }
}

export function showFMenu(mid) {
    var surl = "http://localhost:5000/fmenus"; 
    var ipdata = JSON.stringify({
        mid : mid
    });
    callApi("POST", surl, ipdata, loadFMenus, errorResponse);
        
    var fmenu = document.getElementById(mid);
    if(fmenu.style.display === "block")
        fmenu.style.display = "none";
    else
        fmenu.style.display = "block";
}

export function loadFMenus(res) {
    var data = JSON.parse(res);
    var fmenuitems = "";
    var fmenu = document.getElementById(`${data[0].mid}`); // Get the parent fmenu element
    for(var x of data) {
        fmenuitems += `<label id='${x.smid}'>${x.smtitle}</label>`;
    }
    fmenu.innerHTML = fmenuitems;
// eslint-disable-next-line
    for(var x of data) {
        document.getElementById(`${x.smid}`).addEventListener("click", loadFModule.bind(null, x.smid));
    }
}

export function loadFModule(smid) {
   var titlebar = document.getElementById('titlebar');
   var module = document.getElementById('module');
   switch(smid) {
            case "F00101":
                module.src = "/facultycomponents/book";
                titlebar.innerText = "Add Course";
                break;
            case "F00102":
                module.src = "/facultycomponents/viewcourses";
                titlebar.innerText = "View Courses";
                break;
            case "F10101":
                module.src = "/components/myprofile";
                titlebar.innerText = "My profile";
                break; 
            case "F10102":
                module.src = "/components/changepassword";
                titlebar.innerText = "Change Password";
                break;
            case "F20101":
                module.src = "/facultycomponents/viewstudent";
                titlebar.innerText = "View Student";
                break;
            case "F20102":
                module.src = "/facultycomponents/addstudent";
                titlebar.innerText = "Add Student";
                break;
            case "F20103":
                    module.src = "/facultycomponents/deletestudent";
                    titlebar.innerText = "Delete Student";
                    break;    
            case "F30101":
                module.src = "/facultycomponents/attendance";
                titlebar.innerText = "Mark Attendance";
                break;  
            case "F30102":
                module.src = "/facultycomponents/viewattendance";
                titlebar.innerText = "View Attendance";
                break;  
            case "F40101":
                module.src = "/facultycomponents/viewfeedback";
                titlebar.innerText = "View Feedback";
                break;            
            default:
                module.src = "";
                titlebar.innerText = "";
   }
}

class FacultyHome extends React.Component {
    constructor() {
        super();
        this.sid = getSession("sid");
        if(this.sid === "")
            window.location.replace("/");

        var url = "http://localhost:5000/uname";
        var data = JSON.stringify({
            emailid : this.sid
        });
        callApi("POST", url, data, this.loadUname, errorResponse);

        url = "http://localhost:5000/fmenu";
        callApi("POST", url, "", loadFMenu, errorResponse);
    }

    loadUname(res) {
        var data = JSON.parse(res);
        var HL1 = document.getElementById("HL1");
        HL1.innerText = `${data[0].firstname} ${data[0].lastname}`;
    }

    logout() {
        setSession("sid", "", -1);
        window.location.replace("/");
    }

    render() {
        return(
            <div className='full-height'>
                <div className='header'>
                    <label style={HS1}>Student Course Management System</label>
                    <div className="user-info">
                        <label id='HL1' style={HS4}></label>
                        <div className="logout-container">
                            <label style={HS2} onClick={this.logout}>Logout</label>
                            <img src={logouticon} alt='' style={HS3} onClick={this.logout} />
                        </div>
                    </div>
                </div>
                <div className='content'>
                    <div className='menubar'>
                        <div className='menuheader'>
                            <img src={menuicon} alt='' />
                            <label>MENU</label>
                        </div>
                        <div className='menu'>
                            <nav><ul id='mlist' className='mlist'></ul></nav>
                        </div>
                    </div>
                    <div className='outlet'> 
                        <div id='titlebar'></div>
                        <iframe id='module' src="" title="Module"></iframe>
                    </div>
                </div>
                <div className='footer'>
                    Copyright @ KL University. All rights reserved.
                </div>
            </div>
        );
    }
}

export default FacultyHome;
