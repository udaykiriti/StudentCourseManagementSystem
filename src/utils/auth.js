export const setSession = (key, value) => {
    sessionStorage.setItem(key, value);
};

export const getSession = (key) => {
    return sessionStorage.getItem(key) || '';
};

export const clearSession = (key) => {
    sessionStorage.removeItem(key);
};

export const clearAllSessions = () => {
    sessionStorage.clear();
};

export const isAuthenticated = () => {
    const sid = getSession('sid');
    return sid !== '' && sid !== null;
};

export const logout = () => {
    clearSession('sid');
    window.location.replace('/');
};

export const checkAuth = () => {
    if (!isAuthenticated()) {
        window.location.replace('/');
        return false;
    }
    return true;
};

export const checkAuthInIframe = () => {
    if (!isAuthenticated()) {
        window.parent.location.replace('/');
        return false;
    }
    return true;
};
