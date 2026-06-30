import './Dashboard.css'

const shipmentStatuses = [
  { label: 'Arrived', value: '24%', amount: 24, className: 'arrived' },
  { label: 'Delayed', value: '12%', amount: 12, className: 'delayed' },
  { label: 'Shipped', value: '38%', amount: 38, className: 'shipped' },
  { label: 'Processing', value: '26%', amount: 26, className: 'processing' },
]

const customerActions = [
  { title: 'List Customers', description: 'Review active customer records.', action: 'Open list' },
  { title: 'Add Customer', description: 'Create a new customer profile.', action: 'Add new' },
  { title: 'Edit Customer', description: 'Update names, emails, or status.', action: 'Edit details' },
]

const shipmentActions = [
  { title: 'List Shipments', description: 'Inspect all shipment entries.', action: 'Open list' },
  { title: 'Create Shipment', description: 'Add a shipment to the workflow.', action: 'Create new' },
  { title: 'Update Shipment Status', description: 'Move shipment progress forward.', action: 'Update status' },
]

function Dashboard() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-hero">
          <div className="dashboard-title-block">
            <p className="dashboard-kicker">Operations dashboard</p>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Monitor customers and shipments from a single command center. The data below is a clean
              demo view for the current assignment UI.
            </p>
          </div>

          <div className="dashboard-badge">Live demo data</div>
        </header>

        <section className="dashboard-grid" aria-label="Key metrics">
          <article className="metric-card">
            <p className="metric-label">Total Customers</p>
            <p className="metric-value">128</p>
            <p className="metric-note">Active customer accounts ready for management.</p>
          </article>

          <article className="metric-card">
            <p className="metric-label">Total Shipments</p>
            <p className="metric-value">342</p>
            <p className="metric-note">Shipments tracked across every stage of delivery.</p>
          </article>

          <article className="metric-card">
            <p className="metric-label">Shipment Status Distribution</p>
            <p className="metric-value">4</p>
            <p className="metric-note">Arrived, Delayed, Shipped, and Processing buckets.</p>
          </article>
        </section>

        <section className="dashboard-columns">
          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Shipment Status Distribution</h2>
                <p className="panel-description">A quick breakdown of shipment progress for the dashboard.</p>
              </div>
            </div>

            <div className="status-chart">
              {shipmentStatuses.map((status) => (
                <div className="status-row" key={status.label}>
                  <div className="status-topline">
                    <span>{status.label}</span>
                    <span>{status.value}</span>
                  </div>
                  <div className="status-track" aria-hidden="true">
                    <div className={`status-fill ${status.className}`} style={{ width: `${status.amount}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Management Summary</h2>
                <p className="panel-description">Quick actions for the core admin workflows.</p>
              </div>
            </div>

            <div className="management-list" role="list">
              {[
                ...customerActions.map((item) => ({ ...item, section: 'Customer Management' })),
                ...shipmentActions.map((item) => ({ ...item, section: 'Shipment Management' })),
              ].map((item) => (
                <div className="management-item" key={`${item.section}-${item.title}`} role="listitem">
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                  <div className="action-pill">{item.action}</div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="management-grid" aria-label="Management areas">
          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Customer Management</h2>
                <p className="panel-description">List, add, and edit customer records.</p>
              </div>
            </div>

            <ul className="management-list">
              {customerActions.map((item) => (
                <li className="management-item" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                  <div className="action-pill">{item.action}</div>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel-card">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">Shipment Management</h2>
                <p className="panel-description">List shipments, create new ones, and update status.</p>
              </div>
            </div>

            <ul className="management-list">
              {shipmentActions.map((item) => (
                <li className="management-item" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                  <div className="action-pill">{item.action}</div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  )
}

export default Dashboard