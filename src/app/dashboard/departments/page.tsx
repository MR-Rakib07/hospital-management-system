'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { API } from '@/api/API'
import { Plus, Trash2, Edit2, Loader2, Tag, Building2 } from 'lucide-react'
import {
  DepartmentItem,
  DesignationItem,
  ApiResponse,
  ApiErrorResponse,
} from '@/types/department'

export default function DepartmentManagementPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([])
  const [designations, setDesignations] = useState<DesignationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [desigModalOpen, setDesigModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null)

  const [deptName, setDeptName] = useState('')
  const [specializationsList, setSpecializationsList] = useState<string[]>([])
  const [currentSpecInput, setCurrentSpecInput] = useState('')
  const [desigName, setDesigName] = useState('')

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message
    }
    if (typeof err === 'object' && err !== null && 'message' in err) {
      const apiErr = err as ApiErrorResponse
      if (typeof apiErr.message === 'string') {
        return apiErr.message
      }
    }
    return 'An unexpected error occurred'
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [deptRes, desigRes] = await Promise.all([
        API<ApiResponse<DepartmentItem[]>>({
          endpoint: '/departments',
          option: { method: 'GET' },
        }),
        API<ApiResponse<DesignationItem[]>>({
          endpoint: '/departments/designations',
          option: { method: 'GET' },
        }),
      ])

      if (deptRes?.data) setDepartments(deptRes.data)
      if (desigRes?.data) setDesignations(desigRes.data)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenDeptModal = (dept?: DepartmentItem) => {
    if (dept) {
      setEditingDept(dept)
      setDeptName(dept.name)
      setSpecializationsList([...dept.specializations])
    } else {
      setEditingDept(null)
      setDeptName('')
      setSpecializationsList([])
    }
    setCurrentSpecInput('')
    setDeptModalOpen(true)
  }

  const handleAddSpecTag = () => {
    const trimmed = currentSpecInput.trim()
    if (trimmed && !specializationsList.includes(trimmed)) {
      setSpecializationsList((prev) => [...prev, trimmed])
      setCurrentSpecInput('')
    }
  }

  const handleRemoveSpecTag = (index: number) => {
    setSpecializationsList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!deptName.trim() || specializationsList.length === 0) return

    try {
      setActionLoading(true)
      if (editingDept) {
        await API<ApiResponse<DepartmentItem>>({
          endpoint: `/departments/${editingDept.id}`,
          option: {
            method: 'PATCH',
            body: JSON.stringify({
              name: deptName.trim(),
              specializations: specializationsList,
            }),
          },
        })
      } else {
        await API<ApiResponse<DepartmentItem>>({
          endpoint: '/departments',
          option: {
            method: 'POST',
            body: JSON.stringify({
              name: deptName.trim(),
              specializations: specializationsList,
            }),
          },
        })
      }

      setDeptModalOpen(false)
      await fetchData()
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveDesignation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!desigName.trim()) return

    try {
      setActionLoading(true)
      await API<ApiResponse<DesignationItem>>({
        endpoint: '/departments/designations',
        option: {
          method: 'POST',
          body: JSON.stringify({ name: desigName.trim() }),
        },
      })
      setDesigName('')
      setDesigModalOpen(false)
      await fetchData()
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Meta Configuration</h1>
          <p className="text-sm text-gray-500">
            Manage departments, medical specializations, and professional designations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDesigModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
          >
            <Tag className="h-4 w-4" />
            Add Designation
          </button>
          <button
            type="button"
            onClick={() => handleOpenDeptModal()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              Departments & Specializations ({departments.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <button
                        type="button"
                        onClick={() => handleOpenDeptModal(dept)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {dept.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-100"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-500" />
              Designations ({designations.length})
            </h2>

            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 shadow-xs">
              {designations.length === 0 ? (
                <div className="p-4 text-xs text-gray-400 text-center">No designations created yet</div>
              ) : (
                designations.map((desig) => (
                  <div key={desig.id} className="p-3.5 text-sm font-medium text-gray-700">
                    {desig.name}
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
            <h3 className="text-lg font-bold text-gray-900">
              {editingDept ? 'Edit Department' : 'Create Department'}
            </h3>
            <form onSubmit={handleSaveDepartment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiology"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Specializations *
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a specialization"
                    value={currentSpecInput}
                    onChange={(e) => setCurrentSpecInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSpecTag()
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecTag}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {specializationsList.map((spec, index) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecTag(index)}
                        className="text-gray-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setDeptModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !deptName.trim() || specializationsList.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
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
            <h3 className="text-lg font-bold text-gray-900">Add New Designation</h3>
            <form onSubmit={handleSaveDesignation} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Designation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Consultant"
                  value={desigName}
                  onChange={(e) => setDesigName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setDesigModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !desigName.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}