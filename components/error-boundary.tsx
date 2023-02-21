import { Component, ExoticComponent, ReactNode } from 'react'

class ErrorBoundary extends Component<{ FallbackComponent: ExoticComponent, children: ReactNode }> {
    state = { hasError: false, error: null, errorInfo: null }
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI

        return { hasError: true }
    }
    componentDidCatch(error: any, errorInfo: any) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
        this.setState({ error, errorInfo })
    }
    render() {
        // Check if the error is thrown
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Oops, there is an error!</h2>
                    <button type="button" onClick={() => this.setState({ hasError: false })}>
                        Try again?
                    </button>
                    {/* {this.state.error ? <p>Error: {this.state.error}</p> : null} */}
                    {this.state.errorInfo ? <p>Error info: {this.state.errorInfo}</p> : null}
                </div>
            )
        }

        // Return children components in case of no error

        return this.props.children
    }
}

export default ErrorBoundary