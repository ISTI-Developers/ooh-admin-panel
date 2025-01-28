import PropTypes from "prop-types";
import { testLinks } from "./__tests__/testLinks";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useFunction } from "~/misc/functions";
import { useServices } from "~/contexts/ServiceContext";

//sidebar main component
function Sidebar() {
  const { toSpaced } = useFunction();
  const { CheckPermission, isViewable } = useServices();
  const location = useLocation();


  return (
    <section className="p-2 pt-1 min-w-[250px] h-fit rounded-md bg-default-100">
      <div className="flex flex-col gap-2">
        {/* map links object */}
        {Object.keys(testLinks).map((head) => {
          return (
            <>
              {/* check if the link is viewable for user role */}
              {isViewable(testLinks[head].map((link) => link.title)) && (
                <p className="uppercase text-sm font-bold text-main-300">
                  {toSpaced(head)}
                </p>
              )}
              {testLinks[head].map((item) => {
                //dashboard will always show
                return item.title === "dashboard" ? (
                  <SidebarItem
                    key={item.title}
                    {...item}
                    isActive={item.link === "" && location.pathname === "/"}
                    isStart
                  />
                ) : (
                  // check permission of user if the link should be shown or not
                  <CheckPermission path={item.title}>
                    <SidebarItem
                      key={item.title}
                      {...item}
                      isActive={location.pathname.includes(item.link)}
                    />
                  </CheckPermission>
                );
              })}
            </>
          );
        })}
      </div>
    </section>
  );
}

//component for sidebar items
function SidebarItem({ title, icon: Icon, link, isActive, isStart }) {
  return (
    <Link
      to={link}
      className={classNames(
        "flex flex-row items-center gap-2 p-2 transition-all rounded-md select-none ml-2",
        isStart && "mt-2",
        isActive
          ? "text-secondary bg-slate-50 border-l-4 border-secondary-500 pointer-events-none"
          : "text-main-500 hover:bg-default-300"
      )}
    >
      <Icon />
      <span className="capitalize font-semibold">{title}</span>
    </Link>
  );
}

SidebarItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.func,
  link: PropTypes.string,
  isActive: PropTypes.bool,
  isStart: PropTypes.bool,
};

export default Sidebar;
