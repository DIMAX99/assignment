import { useEffect, useMemo, useState, type FormEvent } from 'react'
import axios from 'axios'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
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
	const [isModalOpen, setIsModalOpen] = useState(false)

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

	function openCreateModal() {
		resetForm()
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
			origin: form.origin.trim(),
			destination: form.destination.trim(),
			customerId: Number(form.customerId)
		}

		try {
			await api.post('/shipments', payload)
			closeModal()
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
		<main className="shipment-page">
			<section className="shipment-shell">
				<header className="shipment-hero">
					<div className="shipment-hero-text">
						<h1 className="shipment-title">Shipment Dashboard</h1>
						<p className="shipment-subtitle">Create shipments and track every status as they move through transit.</p>
					</div>

					<div className="shipment-badge">
						{loading ? 'Syncing data…' : `${filteredShipments.length} shipments shown`}
					</div>
				</header>

				{error ? (
					<Card role="alert" className="shipment-error">
						{error}
					</Card>
				) : null}

				<section className="shipment-metrics" aria-label="Shipment metrics">
					<Card variant="metric">
						<p className="shipment-metric-label">Total Shipments</p>
						<p className="shipment-metric-value">{shipments.length}</p>
					</Card>

					<Card variant="metric">
						<p className="shipment-metric-label">Processing</p>
						<p className="shipment-metric-value">{processingCount}</p>
					</Card>

					<Card variant="metric">
						<p className="shipment-metric-label">Shipped</p>
						<p className="shipment-metric-value">{shippedCount}</p>
					</Card>

					<Card variant="metric">
						<p className="shipment-metric-label">Delayed</p>
						<p className="shipment-metric-value">{delayedCount}</p>
					</Card>

					<Card variant="metric">
						<p className="shipment-metric-label">Arrived</p>
						<p className="shipment-metric-value">{arrivedCount}</p>
					</Card>
				</section>

				<section aria-label="Shipment management">
					<Card>
						<div className="shipment-panel-header">
							<div>
								<h2 className="shipment-panel-title">Shipment List</h2>
								<p className="shipment-panel-description">
									Search and filter shipments, and update status as they move through transit.
								</p>
							</div>

							<Button type="button" variant="pill" onClick={openCreateModal}>
								Create Shipment
							</Button>
						</div>

						<div className="shipment-toolbar">
							<input
								className="shipment-search-input"
								type="search"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Search by tracking number, origin, or destination"
							/>

							<select
								className="shipment-status-select"
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
							<div className="shipment-empty-state">Loading shipments…</div>
						) : filteredShipments.length === 0 ? (
							<div className="shipment-empty-state">
								<strong>No shipments found</strong>
								<span>Create a shipment or adjust the filters.</span>
							</div>
						) : (
							<ul className="shipment-list">
								{filteredShipments.map((shipment) => (
									<li className="shipment-list-item" key={shipment.id}>
										<div className="shipment-list-item-info">
											<strong>{shipment.trackingNumber}</strong>
											<span>
												{shipment.origin} → {shipment.destination}
											</span>
											<span>Customer: {shipment.customerId ?? 'Unassigned'}</span>
										</div>

										<div className="shipment-list-item-actions">
											<select
												className="shipment-status-update"
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

						<p className="shipment-footer-note">
							Shipment count: {shipments.length} · Shown: {filteredShipments.length}
						</p>
					</Card>
				</section>

				{isModalOpen ? (
					<div className="shipment-modal-backdrop" role="presentation" onClick={closeModal}>
						<div
							className="shipment-modal"
							role="dialog"
							aria-modal="true"
							aria-labelledby="shipment-modal-title"
							onClick={(event) => event.stopPropagation()}
						>
							<div className="shipment-panel-header">
								<div>
									<h2 className="shipment-panel-title" id="shipment-modal-title">
										Create Shipment
									</h2>
									<p className="shipment-panel-description">
										Create a shipment with a tracking number, route, and optional customer.
									</p>
								</div>

								<Button type="button" variant="pill" onClick={closeModal}>
									Close
								</Button>
							</div>

							<form className="shipment-form" onSubmit={handleSubmit}>
								<div className="shipment-form-fields">
									<label className="shipment-field">
										<span className="shipment-field-label">Customer ID</span>
										<input
											className="shipment-field-input"
											type="number"
											value={form.customerId}
											onChange={(event) => setForm((current) => ({ ...current, customerId: event.target.value }))}
											placeholder="1"
											min={1}
										/>
									</label>

									<label className="shipment-field">
										<span className="shipment-field-label">Origin</span>
										<input
											className="shipment-field-input"
											type="text"
											value={form.origin}
											onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))}
											placeholder="New York"
											required
										/>
									</label>

									<label className="shipment-field">
										<span className="shipment-field-label">Destination</span>
										<input
											className="shipment-field-input"
											type="text"
											value={form.destination}
											onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
											placeholder="Boston"
											required
										/>
									</label>
								</div>

								<div className="shipment-form-actions">
									<p className="shipment-form-hint">Backed by /api/shipments only.</p>
									<div className="shipment-form-buttons">
										<Button type="button" variant="pill" onClick={closeModal}>
											Cancel
										</Button>
										<Button type="submit" disabled={saving}>
											{saving ? 'Saving…' : 'Create shipment'}
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

export default ShipmentDashboard