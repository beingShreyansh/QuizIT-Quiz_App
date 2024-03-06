import React, { Component } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Chart from '../../components/charts/chart';
import Table from '../../components/table/table';
const AdminDashboard = () => {
  return (

    <>
    <Navbar />
    <Table />
    <Chart/>
    </>
  )
}

export default AdminDashboard