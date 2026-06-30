import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
// import '../dashboard/Dashboard.css'
import './Shipment.css'

type ShipmentStatus = 'ARRIVED' | 'DELAYED' | 'SHIPPED' | 'PROCESSING'
type StatusFilter = ShipmentStatus | 'ALL'

type Shipment = {
	id: number
	trackingNumber: string
	customerId: number | null
	origin: string
	destination: string
	status: ShipmentStatus
}

type ShipmentFormState = {
	customerId: string
	origin: string
	destination: string
}

type ApiResponse<T> = {
	success?: boolean
	message?: string
	data?: T
}

const emptyForm: ShipmentFormState = {
	customerId: '',
	origin: '',
	destination: ''
}

const statusOptions: ShipmentStatus[] = ['PROCESSING', 'SHIPPED', 'DELAYED', 'ARRIVED']

const backendUrl = 'http://localhost:5000/api'
const api = axios.create({
	baseURL: backendUrl,
	headers: {
		'Content-Type': 'application/json'
	}
})

function getShipmentList(response: ApiResponse<Shipment[]> | Shipment[]) {
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

	return 'Something went wrong while loading shipments.'
}

function ShipmentDashboard() {
	const [shipments, setShipments] = useState<Shipment[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [updatingId, setUpdatingId] = useState<number | null>(null)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
	const [form, setForm] = useState<ShipmentFormState>(emptyForm)

	const loadShipments = async () => {
		try {
			const response = await api.get<ApiResponse<Shipment[]> | Shipment[]>('/shipments')
			setShipments(getShipmentList(response.data))
		} catch (err) {
			setError(getErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		void loadShipments()
	}, [])

	const filteredShipments = useMemo(() => {
		const query = searchTerm.trim().toLowerCase()

		return shipments.filter((shipment) => {
			const matchesSearch =
				!query ||
				shipment.trackingNumber.toLowerCase().includes(query) ||
				shipment.origin.toLowerCase().includes(query) ||
				shipment.destination.toLowerCase().includes(query)

			const matchesStatus = statusFilter === 'ALL' || shipment.status === statusFilter

			return matchesSearch && matchesStatus
		})
	}, [shipments, searchTerm, statusFilter])

	const arrivedCount = shipments.filter((shipment) => shipment.status === 'ARRIVED').length
	const shippedCount = shipments.filter((shipment) => shipment.status === 'SHIPPED').length
	const delayedCount = shipments.filter((shipment) => shipment.status === 'DELAYED').length
	const processingCount = shipments.filter((shipment) => shipment.status === 'PROCESSING').length

	function resetForm() {
		setForm(emptyForm)
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSaving(true)
		setError('')

		const payload = {
			origin: form.origin.trim(),
			destination: form.destination.trim(),
			customerId: Number(form.customerId)
		}

		try {
			await api.post('/shipments', payload)
			resetForm()
			await loadShipments()
		} catch (err) {
			setError(getErrorMessage(err))
		} finally {
			setSaving(false)
		}
	}

	async function handleStatusChange(id: number, status: ShipmentStatus) {
		setUpdatingId(id)
		setError('')

		try {
			await api.put(`/shipments/${id}/status`, { status })
			await loadShipments()
		} catch (err) {
			setError(getErrorMessage(err))
		} finally {
			setUpdatingId(null)
		}
	}

	return (
		<main className="dashboard-page">
			<section className="dashboard-shell">
				<header className="dashboard-hero">
					<div className="dashboard-title-block">
						<p className="dashboard-kicker">Logistics operations</p>
						<h1 className="dashboard-title">Shipment Dashboard</h1>
						<p className="dashboard-subtitle">
							Track shipments end to end, backed by the shipment API only: create shipments and update their delivery status.
						</p>
					</div>

					<div className="dashboard-badge">
						{loading ? 'Syncing data…' : `${filteredShipments.length} shipments shown`}
					</div>
				</header>

				{error ? (
					<Card role="alert" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>
						{error}
					</Card>
				) : null}

				<section className="dashboard-grid" aria-label="Shipment metrics">
					<Card variant="metric">
						<p className="metric-label">Total Shipments</p>
						<p className="metric-value">{shipments.length}</p>
						<p className="metric-note">All shipment records currently returned by the API.</p>
					</Card>

					<Card variant="metric">
						<p className="metric-label">Processing</p>
						<p className="metric-value">{processingCount}</p>
						<p className="metric-note">Shipments created but not yet shipped.</p>
					</Card>

					<Card variant="metric">
						<p className="metric-label">Shipped</p>
						<p className="metric-value">{shippedCount}</p>
						<p className="metric-note">Shipments currently in transit.</p>
					</Card>

					<Card variant="metric">
						<p className="metric-label">Delayed</p>
						<p className="metric-value">{delayedCount}</p>
						<p className="metric-note">Shipments flagged as delayed.</p>
					</Card>

					<Card variant="metric">
						<p className="metric-label">Arrived</p>
						<p className="metric-value">{arrivedCount}</p>
						<p className="metric-note">Shipments that have reached their destination.</p>
					</Card>
				</section>

				<section className="management-grid" aria-label="Shipment management">
					<Card>
						<div className="panel-header">
							<div>
								<h2 className="panel-title">New Shipment</h2>
								<p className="panel-description">Create a shipment with a tracking number, route, and optional customer.</p>
							</div>
						</div>

						<form className="customer-form" onSubmit={handleSubmit}>
							<div style={{ display: 'grid', gap: '14px' }}>
								<label style={{ display: 'grid', gap: '8px' }}>
									<span className="field-label">Customer ID</span>
									<input
										className="field-input"
										type="number"
										value={form.customerId}
										onChange={(event) => setForm((current) => ({ ...current, customerId: event.target.value }))}
										placeholder="1"
										min={1}
									/>
								</label>

								<label style={{ display: 'grid', gap: '8px' }}>
									<span className="field-label">Origin</span>
									<input
										className="field-input"
										type="text"
										value={form.origin}
										onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))}
										placeholder="New York"
										required
									/>
								</label>

								<label style={{ display: 'grid', gap: '8px' }}>
									<span className="field-label">Destination</span>
									<input
										className="field-input"
										type="text"
										value={form.destination}
										onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
										placeholder="Boston"
										required
									/>
								</label>
							</div>

							<div className="login-actions" style={{ marginTop: '18px' }}>
								<Button type="submit" disabled={saving}>
									{saving ? 'Saving…' : 'Create shipment'}
								</Button>
							</div>
						</form>
					</Card>

					<Card>
						<div className="panel-header">
							<div>
								<h2 className="panel-title">Shipment List</h2>
								<p className="panel-description">
									Search and filter shipments, and update status as they move through transit.
								</p>
							</div>
						</div>

						<div style={{ display: 'grid', gap: '14px', marginBottom: '18px' }}>
							<input
								className="field-input"
								type="search"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Search by tracking number, origin, or destination"
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
							<div className="management-item">Loading shipments…</div>
						) : filteredShipments.length === 0 ? (
							<div className="management-item">
								<div>
									<strong>No shipments found</strong>
									<span>Create a shipment or adjust the filters.</span>
								</div>
							</div>
						) : (
							<ul className="management-list">
								{filteredShipments.map((shipment) => (
									<li className="management-item" key={shipment.id}>
										<div style={{ minWidth: 0 }}>
											<strong>{shipment.trackingNumber}</strong>
											<span>
												{shipment.origin} → {shipment.destination}
											</span>
											<span>Customer: {shipment.customerId ?? 'Unassigned'}</span>
										</div>

										<div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
											<select
												className="field-input"
												value={shipment.status}
												disabled={updatingId === shipment.id}
												onChange={(event) =>
													handleStatusChange(shipment.id, event.target.value as ShipmentStatus)
												}
											>
												{statusOptions.map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
										</div>
									</li>
								))}
							</ul>
						)}

						<p className="panel-description" style={{ marginTop: '16px' }}>
							Shipment count: {shipments.length} · Shown: {filteredShipments.length}
						</p>
					</Card>
				</section>
			</section>
		</main>
	)
}

export default ShipmentDashboard
