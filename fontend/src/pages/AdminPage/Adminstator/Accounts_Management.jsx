import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const Accounts_Management = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get('http://localhost:5001/api/employee')
        // expecting res.data.data or array
        const data = res.data?.data || res.data || []
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // derive lists for filters
  const specialties = useMemo(() => {
    const s = new Set()
    items.forEach((it) => {
      if (it.specialty) s.add(it.specialty)
      if (it.Specialty) s.add(it.Specialty)
    })
    return Array.from(s).filter(Boolean)
  }, [items])

  const positions = useMemo(() => {
    const s = new Set()
    items.forEach((it) => {
      if (it.position) s.add(it.position)
    })
    return Array.from(s).filter(Boolean)
  }, [items])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      if (filterRole && (it.role_user || it.role) !== filterRole) return false
      if (filterSpecialty) {
        const spec = (it.specialty || it.Specialty || '').toLowerCase()
        if (!spec.includes(filterSpecialty.toLowerCase())) return false
      }
      if (!q) return true
      const full = `${it.full_name || it.fullName || ''}`.toLowerCase()
      const card = `${it.card_id || it.cardId || it.cccd || ''}`.toLowerCase()
      const emp = `${it.employee_id || it.employeeId || ''}`.toLowerCase()
      const phone = `${it.phone_number || it.phone || ''}`.toLowerCase()
      const spec = `${it.specialty || it.Specialty || ''}`.toLowerCase()
      return full.includes(q) || card.includes(q) || emp.includes(q) || phone.includes(q) || spec.includes(q)
    })
  }, [items, search, filterRole, filterSpecialty])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý Tài khoản (Khách hàng & Nhân viên)</h2>

      <div className="flex gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo họ tên, CCCD, mã nhân viên, chuyên khoa..."
          className="border rounded px-3 py-2 w-80"
        />

        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border rounded px-2 py-2">
          <option value="">Tất cả vai trò</option>
          <option value="users">Khách hàng</option>
          <option value="employees">Nhân viên</option>
          <option value="admins">Quản trị</option>
        </select>

        <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="border rounded px-2 py-2">
          <option value="">Tất cả chuyên khoa</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="ml-auto text-sm text-gray-600">Tổng: {filtered.length}</div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">Họ và tên</th>
              <th className="px-4 py-2">Mã NV</th>
              <th className="px-4 py-2">CCCD</th>
              <th className="px-4 py-2">SĐT</th>
              <th className="px-4 py-2">Vai trò</th>
              <th className="px-4 py-2">Phòng ban</th>
              <th className="px-4 py-2">Chức vụ</th>
              <th className="px-4 py-2">Chuyên khoa</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="p-6 text-center">Đang tải...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            )}
            {!loading && filtered.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{row.full_name || row.fullName || '-'}</td>
                <td className="px-4 py-2">{row.employee_id || row.employeeId || '-'}</td>
                <td className="px-4 py-2">{row.card_id || row.cardId || row.cccd || '-'}</td>
                <td className="px-4 py-2">{row.phone_number || row.phone || '-'}</td>
                <td className="px-4 py-2">{row.role_user || row.role || '-'}</td>
                <td className="px-4 py-2">{row.department || row.dept || '-'}</td>
                <td className="px-4 py-2">{row.position || '-'}</td>
                <td className="px-4 py-2">{row.specialty || row.Specialty || '-'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Xem</button>
                    <button className="px-2 py-1 bg-yellow-400 text-black rounded text-sm">Sửa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="mt-3 text-red-600">{error}</p>}
    </div>
  )
}

export default Accounts_Management