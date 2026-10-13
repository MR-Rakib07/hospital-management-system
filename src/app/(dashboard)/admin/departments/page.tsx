'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Loader2, Tag, Building2, UserCheck, Stethoscope } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchDepartmentsThunk,
  fetchDesignationsThunk,
  createDepartmentThunk,
  updateDepartmentThunk,
  deleteDepartmentThunk,
  createDesignationThunk,
  updateDesignationThunk,
  deleteDesignationThunk,
  clearDepartmentMessages,
  type RoleType,
  type DepartmentItem,
  type DesignationItem,
} from '@/redux/department/departmentSlice'

export default function DepartmentManagementPage() {
  const dispatch = useAppDispatch()
  const {
    departments,
    designations,
    loading,
    actionLoading,
    error,
    actionError,
    successMessage,
  } = useAppSelector((state) => state.department)

  const [activeTab, setActiveTab] = useState<RoleType>('DOCTOR')

  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null)
  const [deptName, setDeptName] = useState('')
  const [deptRoleType, setDeptRoleType] = useState<RoleType>('DOCTOR')

  const [desigModalOpen, setDesigModalOpen] = useState(false)
  const [editingDesig, setEditingDesig] = useState<DesignationItem | null>(null)
  const [desigName, setDesigName] = useState('')
  const [desigRoleType, setDesigRoleType] = useState<RoleType>('DOCTOR')

  useEffect(() => {
    void dispatch(fetchDepartmentsThunk())
    void dispatch(fetchDesignationsThunk())
  }, [dispatch])

  useEffect(() => {
    if (successMessage || error || actionError) {
      const timer = setTimeout(() => {
        dispatch(clearDepartmentMessages())
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, error, actionError, dispatch])

  const handleOpenDeptModal = (dept?: DepartmentItem) => {
    if (dept) {
      setEditingDept(dept)
      setDeptName(dept.name)
      setDeptRoleType(dept.roleType)
    } else {
      setEditingDept(null)
      setDeptName('')
      setDeptRoleType(activeTab)
    }
    setDeptModalOpen(true)
  }

  const handleOpenDesigModal = (desig?: DesignationItem) => {
    if (desig) {
      setEditingDesig(desig)
      setDesigName(desig.name)
      setDesigRoleType(desig.roleType)
    } else {
      setEditingDesig(null)
      setDesigName('')
      setDesigRoleType(activeTab)
    }
    setDesigModalOpen(true)
  }

  const handleSaveDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!deptName.trim()) return

    try {
      if (editingDept) {
        await dispatch(
          updateDepartmentThunk({
            id: editingDept.id,
            data: { name: deptName.trim(), roleType: deptRoleType },
          })
        ).unwrap()
      } else {
        await dispatch(
          createDepartmentThunk({
            name: deptName.trim(),
            roleType: deptRoleType,
          })
        ).unwrap()
      }
      setDeptModalOpen(false)
    } catch {}
  }

  const handleSaveDesignation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!desigName.trim()) return

    try {
      if (editingDesig) {
        await dispatch(
          updateDesignationThunk({
            id: editingDesig.id,
            data: { name: desigName.trim(), roleType: desigRoleType },
          })
        ).unwrap()
      } else {
        await dispatch(
          createDesignationThunk({
            name: desigName.trim(),
            roleType: desigRoleType,
          })
        ).unwrap()
      }
      setDesigModalOpen(false)
    } catch {}
  }

  const handleDeleteDepartment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await dispatch(deleteDepartmentThunk(id))
    }
  }

  const handleDeleteDesignation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this designation?')) {
      await dispatch(deleteDesignationThunk(id))
    }
  }

  const filteredDepartments = departments.filter((d) => d.roleType === activeTab)
  const filteredDesignations = designations.filter((d) => d.roleType === activeTab)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Meta Configuration</h1>
          <p className="text-sm text-gray-500">
            Role-based departments and professional designations for Doctors and Staff
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenDesigModal()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
          >
            <Tag className="h-4 w-4" />
            Add Designation
          </button>
          <button
            type="button"
            onClick={() => handleOpenDeptModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('DOCTOR')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'DOCTOR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Stethoscope className="h-4 w-4" />
          Doctor Configuration
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('STAFF')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'STAFF'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Staff Configuration
        </button>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {successMessage}
        </div>
      )}

      {(error || actionError) && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error || actionError}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              {activeTab === 'DOCTOR' ? 'Doctor' : 'Staff'} Departments ({filteredDepartments.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDepartments.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-xs text-gray-400">
                  No departments found for {activeTab.toLowerCase()} role.
                </div>
              ) : (
                filteredDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{dept.name}</h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {dept.roleType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenDeptModal(dept)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                        title="Edit Department"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer disabled:opacity-50"
                        title="Delete Department"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-500" />
              {activeTab === 'DOCTOR' ? 'Doctor' : 'Staff'} Designations ({filteredDesignations.length})
            </h2>

            <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100 shadow-xs overflow-hidden">
              {filteredDesignations.length === 0 ? (
                <div className="p-8 text-xs text-gray-400 text-center">
                  No designations found for {activeTab.toLowerCase()} role.
                </div>
              ) : (
                filteredDesignations.map((desig) => (
                  <div
                    key={desig.id}
                    className="p-3.5 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50/50 transition"
                  >
                    <div>
                      <p className="text-gray-900">{desig.name}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {desig.roleType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenDesigModal(desig)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
                        title="Edit Designation"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleDeleteDesignation(desig.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer disabled:opacity-50"
                        title="Delete Designation"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {deptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingDept ? 'Edit Department' : 'Create Department'}
            </h3>
            <form onSubmit={handleSaveDepartment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Target Role *</label>
                <select
                  value={deptRoleType}
                  onChange={(e) => setDeptRoleType(e.target.value as RoleType)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="DOCTOR">Doctor</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology or Front Desk"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !deptName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingDept ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {desigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingDesig ? 'Edit Designation' : 'Add New Designation'}
            </h3>
            <form onSubmit={handleSaveDesignation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Target Role *</label>
                <select
                  value={desigRoleType}
                  onChange={(e) => setDesigRoleType(e.target.value as RoleType)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="DOCTOR">Doctor</option>
                  <option value="STAFF">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Designation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Consultant or Counter Executive"
                  value={desigName}
                  onChange={(e) => setDesigName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setDesigModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !desigName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingDesig ? 'Update' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}