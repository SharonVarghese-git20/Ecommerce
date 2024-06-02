import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'

const Users = () => {
  const [users,setUsers]=useState([])
  useEffect(()=>{
    axios.get('http://localhost:4000/user')
    .then(users =>setUsers(users.data))
    .catch(err =>console.log(err))
  },[])
  return (
    <div>
      <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {users.map(user =>{
                  
                  return(
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td></td>
                  </tr>
                  )
                })}
              </tr>
            </tbody>
          </table>
        
    </div>
  )
}

export default Users