class Employee {
    constructor(account, fullName, email, password, workingDay, basicSalary, position, workingHours) {
        this.account = account;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.workingDay = workingDay;
        this.basicSalary = basicSalary;
        this.position = position;
        this.workingHours = workingHours;
        this.totalSalary = this.calculateTotalSalary();
        this.classification = this.classifyEmployee();
    }

    calculateTotalSalary() {
        switch (this.position) {
            case 'Giám đốc':
                return this.basicSalary * 3;
            case 'Trưởng Phòng':
                return this.basicSalary * 2;
            case 'Nhân Viên':
                return this.basicSalary;
            default:
                return 0;
        }
    }

    classifyEmployee() {
        if (this.workingHours >= 192) {
            return 'Xuất sắc';
        } else if (this.workingHours >= 176) {
            return 'Giỏi';
        } else if (this.workingHours >= 160) {
            return 'Khá';
        } else {
            return 'Trung bình';
        }
    }
}

let employees = [];
let currentEditIndex = null;

function validateForm(data) {
    const accountPattern = /^\d{4,6}$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{6,10}$/;
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!accountPattern.test(data.account)) return "Tài khoản không hợp lệ";
    if (!namePattern.test(data.fullName)) return "Tên không hợp lệ";
    if (!emailPattern.test(data.email)) return "Email không hợp lệ";
    if (!passwordPattern.test(data.password)) return "Mật khẩu không hợp lệ";
    if (!datePattern.test(data.workingDay)) return "Ngày làm không hợp lệ";
    if (data.basicSalary < 1000000 || data.basicSalary > 20000000) return "Lương cơ bản không hợp lệ";
    if (!['Giám đốc', 'Trưởng Phòng', 'Nhân Viên'].includes(data.position)) return "Chức vụ không hợp lệ";
    if (data.workingHours < 80 || data.workingHours > 200) return "Giờ làm không hợp lệ";

    return null;
}

function addEmployee() {
    const formData = {
        account: document.getElementById('account').value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        workingDay: document.getElementById('workingDay').value,
        basicSalary: parseFloat(document.getElementById('basicSalary').value),
        position: document.getElementById('position').value,
        workingHours: parseFloat(document.getElementById('workingHours').value),
    };

    const validationError = validateForm(formData);
    if (validationError) {
        alert(validationError);
        return;
    }

    if (currentEditIndex === null) {
        const newEmployee = new Employee(
            formData.account,
            formData.fullName,
            formData.email,
            formData.password,
            formData.workingDay,
            formData.basicSalary,
            formData.position,
            formData.workingHours
        );

        employees.push(newEmployee);
    } else {
        employees[currentEditIndex] = new Employee(
            formData.account,
            formData.fullName,
            formData.email,
            formData.password,
            formData.workingDay,
            formData.basicSalary,
            formData.position,
            formData.workingHours
        );
        currentEditIndex = null;
    }

    renderTable();
    resetForm();
}

function resetForm() {
    document.getElementById('employeeForm').reset();
}

function renderTable() {
    const tbody = document.getElementById('employeeTable');
    tbody.innerHTML = '';

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');

        const accountCell = document.createElement('td');
        accountCell.textContent = employee.account;
        row.appendChild(accountCell);

        const fullNameCell = document.createElement('td');
        fullNameCell.textContent = employee.fullName;
        row.appendChild(fullNameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = employee.email;
        row.appendChild(emailCell);

        const workingDayCell = document.createElement('td');
        workingDayCell.textContent = employee.workingDay;
        row.appendChild(workingDayCell);

        const positionCell = document.createElement('td');
        positionCell.textContent = employee.position;
        row.appendChild(positionCell);

        const totalSalaryCell = document.createElement('td');
        totalSalaryCell.textContent = employee.totalSalary;
        row.appendChild(totalSalaryCell);

        const classificationCell = document.createElement('td');
        classificationCell.textContent = employee.classification;
        row.appendChild(classificationCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        actionsCell.innerHTML = `
            <button class="delete btn btn-danger" onclick="deleteEmployee(${index})">Xóa</button>
            <button class="edit btn btn-warning" onclick="editEmployee(${index})">Sửa</button>
        `;
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function deleteEmployee(index) {
    employees.splice(index, 1);
    renderTable();
}

function editEmployee(index) {
    const employee = employees[index];

    document.getElementById('account').value = employee.account;
    document.getElementById('fullName').value = employee.fullName;
    document.getElementById('email').value = employee.email;
    document.getElementById('password').value = employee.password;
    document.getElementById('workingDay').value = employee.workingDay;
    document.getElementById('basicSalary').value = employee.basicSalary;
    document.getElementById('position').value = employee.position;
    document.getElementById('workingHours').value = employee.workingHours;

    currentEditIndex = index;
}

function searchEmployee() {
    const classification = document.getElementById('searchClassification').value.trim();
    if (classification === '') {
        renderTable();
        return;
    }
    const filteredEmployees = employees.filter(employee => employee.classification === classification);

    const tbody = document.getElementById('employeeTable');
    tbody.innerHTML = '';

    filteredEmployees.forEach((employee, index) => {
        const row = document.createElement('tr');

        const accountCell = document.createElement('td');
        accountCell.textContent = employee.account;
        row.appendChild(accountCell);

        const fullNameCell = document.createElement('td');
        fullNameCell.textContent = employee.fullName;
        row.appendChild(fullNameCell);

        const emailCell = document.createElement('td');
        emailCell.textContent = employee.email;
        row.appendChild(emailCell);

        const workingDayCell = document.createElement('td');
        workingDayCell.textContent = employee.workingDay;
        row.appendChild(workingDayCell);

        const positionCell = document.createElement('td');
        positionCell.textContent = employee.position;
        row.appendChild(positionCell);

        const totalSalaryCell = document.createElement('td');
        totalSalaryCell.textContent = employee.totalSalary;
        row.appendChild(totalSalaryCell);

        const classificationCell = document.createElement('td');
        classificationCell.textContent = employee.classification;
        row.appendChild(classificationCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions';
        actionsCell.innerHTML = `
            <button class="delete btn btn-danger" onclick="deleteEmployee(${index})">Xóa</button>
            <button class="edit btn btn-warning" onclick="editEmployee(${index})">Sửa</button>
        `;
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnAddEmployee').addEventListener('click', addEmployee);
    document.getElementById('btnUpdateEmployee').addEventListener('click', addEmployee);
    document.getElementById('btnSearchEmployee').addEventListener('click', searchEmployee);
});
