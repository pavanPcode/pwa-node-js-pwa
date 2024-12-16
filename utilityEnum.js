function OperationEnums() {
    const Operations = {
        getPunchType:1,
        SignIn:2,
        changepassword:3,
        getleavetype:4,
        getempleaves:5,
        saveleave:6,
        getemplast7daysattendance:7,
        getempattendance:8,
        writeswipe:9,
        getempprofile:10,
    };

    return Operations;
}

module.exports = {
    OperationEnums
};
