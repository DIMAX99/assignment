import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import './Customer.css'

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
	const [isModalOpen, setIsModalOpen] = useState(false)
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

	function openCreateModal() {
		resetForm()
		setIsModalOpen(true)
	}

	function startEdit(customer: Customer) {
		setEditingId(customer.id)
		setForm({
			name: customer.name,
			email: customer.email,
			company: customer.company ?? ''
		})
		setIsModalOpen(true)
	}

	function closeModal() {
		setIsModalOpen(false)
		resetForm()
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

			closeModal()
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
		<main className="customer-page">
			<section className="customer-shell">
				<header className="customer-hero">
					<div className="customer-hero-text">
						<h1 className="customer-title">Customer Dashboard</h1>
						<p className="customer-subtitle">Track totals and manage every customer record in one place.</p>
					</div>

					<div className="customer-badge">
						{loading ? 'Syncing data…' : `${filteredCustomers.length} customers shown`}
					</div>
				</header>

				{error ? (
					<Card role="alert" className="customer-error">
						{error}
					</Card>
				) : null}

				<section className="customer-metrics" aria-label="Customer metrics">
					<Card variant="metric">
						<p className="customer-metric-label">Total Customers</p>
						<p className="customer-metric-value">{customers.length}</p>
					</Card>

					<Card variant="metric">
						<p className="customer-metric-label">Active Customers</p>
						<p className="customer-metric-value">{activeCount}</p>
					</Card>

					<Card variant="metric">
						<p className="customer-metric-label">Inactive Customers</p>
						<p className="customer-metric-value">{inactiveCount}</p>
					</Card>
				</section>

				<section aria-label="Customer management">
					<Card>
						<div className="customer-panel-header">
							<div>
								<h2 className="customer-panel-title">Customer List</h2>
								<p className="customer-panel-description">Search, filter, edit, and remove customers from the list.</p>
							</div>

							<Button type="button" variant="pill" onClick={openCreateModal}>
								Create Customer
							</Button>
						</div>

						<div className="customer-toolbar">
							<input
								className="customer-search-input"
								type="search"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Search by name, email, or company"
							/>

							<select
								className="customer-status-select"
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
							<div className="customer-empty-state">Loading customers…</div>
						) : filteredCustomers.length === 0 ? (
							<div className="customer-empty-state">
								<strong>No customers found</strong>
								<span>Add a new customer or adjust the filters.</span>
							</div>
						) : (
							<ul className="customer-list">
								{filteredCustomers.map((customer) => (
									<li className="customer-list-item" key={customer.id}>
										<div className="customer-list-item-info">
											<strong>{customer.name}</strong>
											<span>
												{customer.email}
												{customer.company ? ` · ${customer.company}` : ''}
											</span>
											<span>Status: {customer.status}</span>
										</div>

										<div className="customer-list-item-actions">
											<Button type="button" variant="pill" onClick={() => startEdit(customer)}>
												Edit
											</Button>
											<Button type="button" variant="pill" onClick={() => handleDelete(customer.id)}>
												Delete
											</Button>
										</div>
									</li>
								))}
							</ul>
						)}

						<p className="customer-footer-note">
							Customer count: {customers.length} · Companies: {companyCount}
						</p>
					</Card>
				</section>

				{isModalOpen ? (
					<div className="customer-modal-backdrop" role="presentation" onClick={closeModal}>
						<div
							className="customer-modal"
							role="dialog"
							aria-modal="true"
							aria-labelledby="customer-modal-title"
							onClick={(event) => event.stopPropagation()}
						>
							<div className="customer-panel-header">
								<div>
									<h2 className="customer-panel-title" id="customer-modal-title">
										{editingId === null ? 'Create Customer' : `Edit Customer #${editingId}`}
									</h2>
									<p className="customer-panel-description">
										{editingId === null
											? 'Fill in the fields and create a new customer record.'
											: 'Update the customer details and save the changes.'}
									</p>
								</div>

								<Button type="button" variant="pill" onClick={closeModal}>
									Close
								</Button>
							</div>

							<form className="customer-form" onSubmit={handleSubmit}>
								<div className="customer-form-fields">
									<label className="customer-field">
										<span className="customer-field-label">Name</span>
										<input
											className="customer-field-input"
											type="text"
											value={form.name}
											onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
											placeholder="Jane Doe"
											required
										/>
									</label>

									<label className="customer-field">
										<span className="customer-field-label">Email</span>
										<input
											className="customer-field-input"
											type="email"
											value={form.email}
											onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
											placeholder="jane@example.com"
											required
										/>
									</label>

									<label className="customer-field">
										<span className="customer-field-label">Company</span>
										<input
											className="customer-field-input"
											type="text"
											value={form.company}
											onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
											placeholder="Acme Inc"
										/>
									</label>
								</div>

								<div className="customer-form-actions">
									<p className="customer-form-hint">Backed by /api/customers only.</p>
									<div className="customer-form-buttons">
										<Button type="button" variant="pill" onClick={closeModal}>
											Cancel
										</Button>
										<Button type="submit" disabled={saving}>
											{saving ? 'Saving…' : editingId === null ? 'Create customer' : 'Update customer'}
										</Button>
									</div>
								</div>
							</form>
						</div>
					</div>
				) : null}
			</section>
		</main>
	)
}

export default CustomerDashboard