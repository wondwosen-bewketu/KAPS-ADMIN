import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersByRole, selectUsers, selectError } from '../../redux/slice/inventorySlice';

const IssuingComponent = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchUsersByRole('Issuing'));
  }, [dispatch]);

  return (
    <div>
      <h2>Issuing Users</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.fullName}</li>
        ))}
      </ul>
    </div>
  );
};

export default IssuingComponent;
