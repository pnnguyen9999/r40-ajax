$(function () {
    $(".header").load("header.html");
    $(".footer").load("footer.html");
    clickNavViewListEmployees();
});

function clickNavHome() {
    $(".main").load("home.html");
}

function clickNavViewListEmployees() {
    $(".main").load("viewlistemployees.html");
    buildTable();
}

var employees = [];
var counter = 0;

function Employee(name, department, phone) {
    this.id = ++counter;
    this.name = name;
    this.department = department;
    this.phone = phone;
}

function initEmployees() {
    if (null == employees || employees.length == 0) {
        // init data
        employees.push(new Employee("John Doe", "Administration", "(171) 555-2222"));
        employees.push(new Employee("Peter Parker", "Customer Service", "(313) 555-5735"));
        employees.push(new Employee("Fran Wilson", "Human Resources", "(503) 555-9931"));
    }
}

function buildTable() {
    $.ajax({
        type: "GET",
        url: "https://6553722e5449cfda0f2eb53b.mockapi.io/employees",
        success: function (response) {
            $('tbody').empty();
            employees = response;
            response.forEach(function (item) {
                $('tbody').append(
                    '<tr>' +
                    '<td>' + item.name + '</td>' +
                    '<td>' + item.department + '</td>' +
                    '<td>' + item.phone + '</td>' +
                    '<td>' +
                    '<a class="edit" title="Edit" data-toggle="tooltip" onclick="openUpdateModal(' + item.id + ')"><i class="material-icons">&#xE254;</i></a>' +
                    '<a class="delete" title="Delete" data-toggle="tooltip" onClick="openConfirmDelete(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
                    '</td>' +
                    '</tr>');
            });
        }
    });
}

function openAddModal() {
    resetForm();
    openModal();
}

function resetForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("department").value = "";
    document.getElementById("phone").value = "";
}

function openModal() {
    $('#myModal').modal('show');
}

function hideModal() {
    $('#myModal').modal('hide');
}

function addEmployee() {
    var name = document.getElementById("name").value;
    var department = document.getElementById("department").value;
    var phone = document.getElementById("phone").value;

    const newEmployee = {
        name,
        department,
        phone
    };

    $.ajax({
        type: "POST",
        url: "https://6553722e5449cfda0f2eb53b.mockapi.io/employees",
        data: JSON.stringify(newEmployee),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            hideModal();
            showSuccessAlert();
            buildTable();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function openUpdateModal(id) {

    // // get index from employee's id
    var index = employees.findIndex(x => x.id == id);

    // // fill data
    document.getElementById("id").value = employees[index].id;
    document.getElementById("name").value = employees[index].name;
    document.getElementById("department").value = employees[index].department;
    document.getElementById("phone").value = employees[index].phone;

    openModal();
}

function save() {
    var id = document.getElementById("id").value;

    if (id == null || id == "") {
        addEmployee();
    } else {
        updateEmployee();
    }
}

function updateEmployee() {
    var id = document.getElementById("id").value;
    var name = document.getElementById("name").value;
    var department = document.getElementById("department").value;
    var phone = document.getElementById("phone").value;

    const updateEmployeeData = {
        name,
        department,
        phone
    };

    $.ajax({
        type: "PUT",
        url: `https://6553722e5449cfda0f2eb53b.mockapi.io/employees/${id}`,
        data: JSON.stringify(updateEmployeeData),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            hideModal();
            showSuccessAlert();
            buildTable();
        }
    });
}


function openConfirmDelete(id) {
    // get index from employee's id
    var index = employees.findIndex(x => x.id == id);
    var name = employees[index].name;

    var result = confirm("Want to delete " + name + "?");
    if (result) {
        deleteEmployee(id);
    }
}

function deleteEmployee(id) {
    $.ajax({
        type: "DELETE",
        url: `https://abc6553722e5449cfda0f2eb53b.mockapi.io/employees/${id}`,
        success: function (response) {
            console.log(response);
            showSuccessAlert();
            buildTable();
        },
        error: function (xhr, status, error) {
            console.log({ xhr, status, error });
            showErrorAlert(error);
        }
    });
}

function showSuccessAlert() {
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#success-alert").slideUp(500);
    });
};

function showErrorAlert(message) {
    $("#error-message").text(message);
    $("#error-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#error-alert").slideUp(500);
    });
};