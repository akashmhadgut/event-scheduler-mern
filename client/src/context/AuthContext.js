import { createContext, useState, useEffect, useContext } from "react";
 
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      }
    } catch (err) {
      console.warn("Failed to parse stored user, clearing localStorage.user", err);
      localStorage.removeItem("user");
    }
  }, []);

  const login = (data) => {
    // Accept both shapes: { user, token } or flattened { ...userFields, token }
    const userObj = data?.user ? data.user : data || null;
    const token = data?.token || (userObj && userObj.token) || null;

    setUser(userObj);
    if (token) localStorage.setItem("token", token);
    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
