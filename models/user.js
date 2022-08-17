class User{
    constructor(userId, username, email, password, roles, account_locked){
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.account_locked = account_locked;
    }
}

exports.User = User;