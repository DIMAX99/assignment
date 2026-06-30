import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import '../dashboard/Dashboard.css'

type CustomerStatus = 'ACTIVE' | 'INACTIVE'
type StatusFilter = CustomerStatus | 'ALL'

type Customer = {
	id: number
	name: string
	email: string
	company?: string | null
	status: CustomerStatus
	deletedAt?: string | null
}

type CustomerFormState = {
	name: string
	email: string
	company: string
}

type ApiResponse<T> = {
	success?: boolean
	message?: string
	data?: T
}

const emptyForm: CustomerFormState = {
	name: '',
	email: '',
	company: ''
}

const statusOptions: CustomerStatus[] = ['ACTIVE', 'INACTIVE']

const backendUrl = "http://localhost:5000/api"
const api = axios.create({
	baseURL: backendUrl,
	headers: {
		'Content-Type': 'application/json',
	},
})

function getCustomerList(response: ApiResponse<Customer[]> | Customer[]) {
	if (Array.isArray(response)) {
		return response
	}

	return response.data ?? []
}

function getErrorMessage(error: unknown) {
	if (axios.isAxiosError(error)) {
		return (error.response?.data as ApiResponse<unknown> | undefined)?.message || error.message
	}

	if (error instanceof Error) {
		return error.message
	}

	return 'Something went wrong while loading customers.'
}

function CustomerDashboard() {
	const [customers, setCustomers] = useState<Customer[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')
	const [editingId, setEditingId] = useState<number | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
	const [form, setForm] = useState<CustomerFormState>(emptyForm)

	const loadCustomers = async () => {
		setLoading(true)
		setError('')

		try {
			const response = await api.get<ApiResponse<Customer[]> | Customer[]>('/customers')
			setCustomers(getCustomerList(response.data))
		} catch (err) {
			setError(getErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadCustomers()
	}, [])

	const filteredCustomers = useMemo(() => {
		const query = searchTerm.trim().toLowerCase()

		return customers.filter((customer) => {
			const matchesSearch =
				!query ||
				customer.name.toLowerCase().includes(query) ||
				customer.email.toLowerCase().includes(query) ||
				(customer.company ?? '').toLowerCase().includes(query)

			const matchesStatus = statusFilter === 'ALL' || customer.status === statusFilter

			return matchesSearch && matchesStatus
		})
	}, [customers, searchTerm, statusFilter])

	const activeCount = customers.filter((customer) => customer.status === 'ACTIVE').length
	const inactiveCount = customers.filter((customer) => customer.status === 'INACTIVE').length
	const companyCount = new Set(customers.map((customer) => customer.company?.trim()).filter(Boolean)).size

	function resetForm() {
		setForm(emptyForm)
		setEditingId(null)
	}

	function startEdit(customer: Customer) {
		setEditingId(customer.id)
		setForm({
			name: customer.name,
			email: customer.email,
			company: customer.company ?? ''
		})
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSaving(true)
		setError('')

		const payload = {
			name: form.name.trim(),
			email: form.email.trim(),
			company: form.company.trim() || undefined
		}

		try {
			if (editingId === null) {
				await api.post('/customers', payload)
			} else {
				await api.put(`/customers/${editingId}`, payload)
			}

			resetForm()
			await loadCustomers()
		} catch (err) {
			setError(getErrorMessage(err))
		} finally {
			setSaving(false)
		}
	}

	async function handleDelete(id: number) {
		setError('')

		try {
			await api.delete(`/customers/${id}`)

			if (editingId === id) {
				resetForm()
			}

			await loadCustomers()
		} catch (err) {
			setError(getErrorMessage(err))
		}
	}

	return (
		<main className="dashboard-page">
			<section className="dashboard-shell">
				<header className="dashboard-hero">
					<div className="dashboard-title-block">
						<p className="dashboard-kicker">Customer operations</p>
						<h1 className="dashboard-title">Customer Dashboard</h1>
						<p className="dashboard-subtitle">
							Manage customer records with the customer API only: list, create, update, and soft delete.
						</p>
					</div>

					<div className="dashboard-badge">
						{loading ? 'Syncing data…' : `${filteredCustomers.length} customers shown`}
					</div>
				</header>

				{error ? (
					<div className="panel-card" role="alert" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>
						{error}
					</div>
				) : null}

				<section className="dashboard-grid" aria-label="Customer metrics">
					<article className="metric-card">
						<p className="metric-label">Total Customers</p>
						<p className="metric-value">{customers.length}</p>
						<p className="metric-note">All active customer records currently returned by the API.</p>
					</article>

					<article className="metric-card">
						<p className="metric-label">Active Customers</p>
						<p className="metric-value">{activeCount}</p>
						<p className="metric-note">Customers marked as ACTIVE and available for operations.</p>
					</article>

					<article className="metric-card">
						<p className="metric-label">Inactive Customers</p>
						<p className="metric-value">{inactiveCount}</p>
						<p className="metric-note">Customers retained in the list but marked as INACTIVE.</p>
					</article>
				</section>

				<section className="management-grid" aria-label="Customer management">
					<article className="panel-card">
						<div className="panel-header">
							<div>
								<h2 className="panel-title">Customer Form</h2>
								<p className="panel-description">
									{editingId === null ? 'Create a new customer.' : `Editing customer #${editingId}.`}
								</p>
							</div>

							{editingId !== null ? (
								<button type="button" className="action-pill" onClick={resetForm}>
									Cancel edit
								</button>
							) : null}
						</div>

						<form className="customer-form" onSubmit={handleSubmit}>
							<div style={{ display: 'grid', gap: '14px' }}>
								<label style={{ display: 'grid', gap: '8px' }}>
									<span className="field-label">Name</span>
									<input
										className="field-input"
										type="text"
										value={form.name}
										onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
										placeholder="Jane Doe"
										required
									/>
								</label>

								<label style={{ display: 'grid', gap: '8px' }}>
									<span className="field-label">Email</span>
									<input
										className="field-input"
										type="email"
										value={form.email}
										onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
										placeholder="jane@example.com"
										required
									/>
								</label>

								<label style={{ display: 'grid', gap: '8px' }}>
									<span className="field-label">Company</span>
									<input
										className="field-input"
										type="text"
										value={form.company}
										onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
										placeholder="Acme Inc"
									/>
								</label>
							</div>

							<div className="login-actions" style={{ marginTop: '18px' }}>
								<p className="login-hint">Backed by /api/customers only.</p>
								<button className="login-button" type="submit" disabled={saving}>
									{saving ? 'Saving…' : editingId === null ? 'Create customer' : 'Update customer'}
								</button>
							</div>
						</form>
					</article>

					<article className="panel-card">
						<div className="panel-header">
							<div>
								<h2 className="panel-title">Customer List</h2>
								<p className="panel-description">Search, filter, edit, and remove customers from the list.</p>
							</div>
						</div>

						<div style={{ display: 'grid', gap: '14px', marginBottom: '18px' }}>
							<input
								className="field-input"
								type="search"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Search by name, email, or company"
							/>

							<select
								className="field-input"
								value={statusFilter}
								onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
							>
								<option value="ALL">All statuses</option>
								{statusOptions.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>

						{loading ? (
							<div className="management-item">Loading customers…</div>
						) : filteredCustomers.length === 0 ? (
							<div className="management-item">
								<div>
									<strong>No customers found</strong>
									<span>Add a new customer or adjust the filters.</span>
								</div>
							</div>
						) : (
							<ul className="management-list">
								{filteredCustomers.map((customer) => (
									<li className="management-item" key={customer.id}>
										<div style={{ minWidth: 0 }}>
											<strong>{customer.name}</strong>
											<span>
												{customer.email}
												{customer.company ? ` · ${customer.company}` : ''}
											</span>
											<span>Status: {customer.status}</span>
										</div>

										<div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
											<button type="button" className="action-pill" onClick={() => startEdit(customer)}>
												Edit
											</button>
											<button type="button" className="action-pill" onClick={() => handleDelete(customer.id)}>
												Delete
											</button>
										</div>
									</li>
								))}
							</ul>
						)}

						<p className="panel-description" style={{ marginTop: '16px' }}>
							Customer count: {customers.length} · Companies: {companyCount}
						</p>
					</article>
				</section>
			</section>
		</main>
	)
}

export default CustomerDashboard
