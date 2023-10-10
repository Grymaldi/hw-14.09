import React, { useState, useEffect } from "react";
import axios from "axios";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((response) => {
      setUsers(response.data);
      setSortedUsers(response.data);
    });
  }, []);

  // Сортировка таблицы по выбранному столбцу
  const handleSort = (key) => {
    const sorted = [...sortedUsers].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setSortedUsers(sorted);
  };

  // Фильтрация пользователей
  const handleFilter = (text) => {
    setFilterText(text);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setSortedUsers(filtered);
  };

  // Удаление пользователя по ID
  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setSortedUsers(updatedUsers);
  };

  // Редактирование данных пользователя
  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  // Сохранение изменений после редактирования
  const handleSave = (userId, newData) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, ...newData } : user
    );
    setUsers(updatedUsers);
    setSortedUsers(updatedUsers);
    setEditingUserId(null);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Поиск по имени"
        value={filterText}
        onChange={(e) => handleFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Имя</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th onClick={() => handleSort("address.city")}>Город</th>
            <th onClick={() => handleSort("phone")}>Телефон</th>
            <th onClick={() => handleSort("website")}>Веб-сайт</th>
            <th onClick={() => handleSort("company.name")}>Компания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) =>
                      handleSave(user.id, { name: e.target.value })
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.address.city}</td>
              <td>{user.phone}</td>
              <td>{user.website}</td>
              <td>{user.company.name}</td>
              <td>
                {editingUserId === user.id ? (
                  <button
                    onClick={() => handleSave(user.id, { name: user.name })}
                  >
                    Сохранить
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user.id)}>
                      Редактировать
                    </button>
                    <button onClick={() => handleDelete(user.id)}>
                      Удалить
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
