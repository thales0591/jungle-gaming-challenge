import { Outlet, createRootRoute } from '@tanstack/react-router'
import { SessionValidator } from '@/components/session-validator'

export const Route = createRootRoute({
  component: () => (
    <>
      <SessionValidator />
      <Outlet />
    </>
  ),
})
