import { Link, matchPath, useLocation } from 'react-router'
import { Baby, LayoutDashboard, Loader2, LogOut } from 'lucide-react'
import { useAuthStore, useLogoutMutation } from '@/features/auth'
import { authRoutes } from '#/features/auth/auth.routes'
import { getSidebarItems } from '#/routes/sidebar'
import { Button } from './ui/Button'
import { useMutationTools } from '#/hooks'
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from './ui/sidebar'
import { cn } from 'cn'
import { Tooltip } from './Tooltip'
import { userRoutes } from '#/features/users/users.routes'
import { brand } from '#/lib/brand'

const sidebarItems = getSidebarItems([...authRoutes, ...userRoutes])

export const Sidebar = () => {
  const { pathname } = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { setOpenMobile } = useSidebar()
  const { safeMutate } = useMutationTools()
  const { mutateAsync: logoutApi, isPending: isLogoutLoading } =
    useLogoutMutation()

  const handleLogout = async () => {
    void (await safeMutate(logoutApi))
    window.location.reload()
  }

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader>
        <Link
          to="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-3 rounded-xl p-2 focus-visible:outline-ring group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0"
          aria-label={`${brand.name} home`}
        >
          <Baby className="size-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-base font-heading font-bold group-data-[collapsible=icon]:hidden">
            {brand.shortName}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            {brand.workspaceLabel}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <nav
              aria-label="Main navigation"
              className="px-2 group-data-[collapsible=icon]:px-0"
            >
              <SidebarMenu className="space-y-1">
                {sidebarItems.map(({ to, title, icon, end, disabled }) => {
                  const Icon = icon ?? LayoutDashboard
                  const isActive = Boolean(
                    matchPath({ path: to, end }, pathname),
                  )

                  return (
                    <SidebarMenuItem key={to}>
                      {disabled ? (
                        <Tooltip
                          content="Nothing to display here"
                          delay={0}
                          side="right"
                          triggerClassName="w-full min-w-0 text-left group-data-[collapsible=icon]:size-8"
                        >
                          <div className="flex w-full items-center gap-2 rounded-md border border-transparent px-3 py-2 text-muted-foreground/60 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0">
                            <Icon
                              className="size-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              {title}: unavailable
                            </span>
                            <span
                              className="group-data-[collapsible=icon]:hidden"
                              aria-hidden="true"
                            >
                              {title}
                            </span>
                          </div>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={title}
                          render={<Link to={to} />}
                          aria-label={title}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setOpenMobile(false)}
                          className={cn(
                            'h-10 rounded-md border text-muted-foreground border-transparent font-medium hover:bg-muted group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0',
                            isActive &&
                              'bg-primary/10! ring-1 ring-primary/30 border-border text-primary! font-semibold',
                          )}
                        >
                          <Icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {title}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <Button
          variant="destructive"
          className="w-full h-10 justify-center group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
          onClick={handleLogout}
          disabled={isLogoutLoading}
          aria-label={isAuthenticated ? 'Logout' : 'Login'}
          title={isAuthenticated ? 'Logout' : 'Login'}
        >
          {isLogoutLoading ? <Loader2 /> : <LogOut />}
          <span className="group-data-[collapsible=icon]:hidden">
            {isLogoutLoading ? 'Logging out...' : 'Logout'}
          </span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </SidebarPrimitive>
  )
}
