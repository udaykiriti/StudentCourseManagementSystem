import React from 'react';
import { GraduationCap, User, Mail, Lock, UserCheck } from 'lucide-react';

const callApi = (method, url, data, successCallback, errorCallback) => {
  setTimeout(() => {
    if (method === "POST" && url.includes("signin")) {
      const parsedData = JSON.parse(data);
      if (parsedData.emailid && parsedData.pwd && parsedData.role) {
        successCallback('1');
      } else {
        successCallback('0');
      }
    } else if (method === "POST" && url.includes("signup")) {
      successCallback('"Registration successful!"');
    }
  }, 500);
};

const errorResponse = (error) => {
  console.error('API Error:', error);
  alert('An error occurred. Please try again.');
};

const setSession = (key, value, minutes) => {
  sessionStorage.setItem(key, value);
  console.log(`Session set: ${key} = ${value} for ${minutes} minutes`);
};

function Login() {
  const [showRegistration, setShowRegistration] = React.useState(false);

  React.useEffect(() => {}, []);

  function validate() {
    const T1 = document.getElementById('T1');
    const T2 = document.getElementById('T2');
    const roleSelect = document.getElementById('roleSelect');

    if (!T1.value || !T2.value || !roleSelect.value) {
      alert('Please fill in all fields');
      return;
    }

    const url = "http://localhost:5000/login/signin";
    const data = JSON.stringify({
      emailid: T1.value,
      pwd: T2.value,
      role: roleSelect.value
    });
    callApi("POST", url, data, loginSuccess, errorResponse);
  }

  function loginSuccess(res) {
    const data = JSON.parse(res);
    if (data === 1) {
      const T1 = document.getElementById('T1');
      setSession("sid", T1.value, (24 * 60));
      const role = document.getElementById('roleSelect').value;
      switch (role) {
        case 'student':
          window.location.replace("/studenthome");
          break;
        case 'faculty':
          window.location.replace("/facultyhome");
          break;
        case 'admin':
          window.location.replace("/adminhome");
          break;
        default:
          alert("Invalid Role");
          break;
      }
    } else {
      alert("Invalid Credentials!");
    }
  }

  function registration() {
    setShowRegistration(true);
  }

  function register() {
    const RT1 = document.getElementById('RT1');
    const RT2 = document.getElementById('RT2');
    const RT3 = document.getElementById('RT3');
    const RT4 = document.getElementById('RT4');
    const RT5 = document.getElementById('RT5');
    const RT6 = document.getElementById('RT6');
    
    [RT1, RT2, RT3, RT4, RT5, RT6].forEach(field => {
      field.classList.remove('border-red-500');
      field.classList.add('border-gray-300');
    });

    const fields = [
      { field: RT1, name: 'First Name' },
      { field: RT2, name: 'Last Name' },
      { field: RT3, name: 'Contact Number' },
      { field: RT4, name: 'Email ID' },
      { field: RT5, name: 'Password' },
      { field: RT6, name: 'Re-type Password' }
    ];

    for (let i = 0; i < fields.length; i++) {
      if (fields[i].field.value === "") {
        fields[i].field.classList.remove('border-gray-300');
        fields[i].field.classList.add('border-red-500');
        fields[i].field.focus();
        return;
      }
    }

    if (RT5.value !== RT6.value) {
      alert("Password and Re-type Password must be same");
      RT5.classList.remove('border-gray-300');
      RT5.classList.add('border-red-500');
      RT5.focus();
      return;
    }

    const url = "http://localhost:5000/registration/signup";
    const data = JSON.stringify({
      firstname: RT1.value,
      lastname: RT2.value,
      contactno: RT3.value,
      emailid: RT4.value,
      pwd: RT5.value,
      role: document.getElementById('roleSelectReg').value
    });
    callApi("POST", url, data, registeredSuccess, errorResponse);

    [RT1, RT2, RT3, RT4, RT5, RT6].forEach(field => {
      field.value = "";
    });

    setShowRegistration(false);
  }

  function registeredSuccess(res) {
    const data = JSON.parse(res);
    alert(data);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-blue-600 py-2 px-4">
        <div className="flex items-center justify-center space-x-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-800">
            Student Course Management System
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {!showRegistration ? (
          /* Login Form */
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Login</h2>
              <p className="text-gray-600 text-xs">Access your academic portal</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Mail className="inline w-3 h-3 mr-1" />
                  Email ID*
                </label>
                <input
                  type="text"
                  id="T1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Lock className="inline w-3 h-3 mr-1" />
                  Password*
                </label>
                <input
                  type="password"
                  id="T2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <User className="inline w-3 h-3 mr-1" />
                  Select Role*
                </label>
                <select
                  id="roleSelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                onClick={validate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Sign In
              </button>

              <div className="text-center pt-2">
                <span className="text-gray-600 text-xs">New user? </span>
                <button
                  onClick={registration}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline text-xs"
                >
                  Register here
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Registration</h2>
              <p className="text-gray-600 text-xs">Create account</p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">First Name*</label>
                <input
                  type="text"
                  id="RT1"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name*</label>
                <input
                  type="text"
                  id="RT2"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Last name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Contact*</label>
                <input
                  type="text"
                  id="RT3"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Contact number"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email ID*</label>
                <input
                  type="text"
                  id="RT4"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Email address"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  id="RT5"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password*</label>
                <input
                  type="password"
                  id="RT6"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  placeholder="Confirm password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role*</label>
                <select
                  id="roleSelectReg"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <button
                onClick={register}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Register
              </button>
              
              <button
                onClick={() => setShowRegistration(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-1 px-4">
        <p className="text-center text-gray-600 text-xs">
          Copyright @ Student Course Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;