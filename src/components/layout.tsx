import { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
// import { ipcRenderer } from "electron";
import { switchServer, updateAddModalVisible } from "@/app/slices/data";
import { useAppSelector } from "@/app/store";
import { ReactComponent as IconAdd } from "@/assets/icons/add.svg";

// import { ReactComponent as IconDelete } from "@/assets/icons/delete.svg";

// import Button from "./base/button";

// type Props = {};

const Layout = () => {
  const { servers, active } = useAppSelector((store) => store.data);
  const dispatch = useDispatch();
  const handleSwitch = (evt: MouseEvent<HTMLLIElement>) => {
    console.log("switch");
    const { url } = evt.currentTarget.dataset;
    if (url == active) return;
    if (url) {
      dispatch(switchServer(url));
    }
  };
  const handleAddServer = () => {
    dispatch(updateAddModalVisible(true));
  };
  // const handleRemove = (url: string) => {
  //   dispatch(removeServer(url));
  // };
  return (
    <section className="flex h-screen bg-gray-200 dark:bg-gray-900 select-none">
      <aside className="app-drag flex flex-col items-center gap-3 w-[60px] h-full ">
        <ul className="flex flex-col gap-2 py-1 text-gray-900 dark:text-gray-100 text-lg">
          {servers.map((server) => {
            const { web_url, api_url, name } = server;
            return (
              <li
                role="button"
                key={web_url}
                className={clsx("relative group px-3 w-full")}
                data-url={web_url}
                onClick={handleSwitch}
                title={name}
              >
                <div
                  className={clsx(
                    "app-no-drag",
                    "w-9 h-9 flex items-center justify-center cursor-pointer rounded hover:bg-gray-500/50",
                    web_url === active && "bg-gray-500/50"
                  )}
                >
                  <img
                    className="w-6 h-6 rounded-full border border-gray-500/20"
                    src={`${
                      api_url || web_url
                    }/api/resource/organization/logo?t=${new Date().getTime()}`}
                    alt="logo"
                  />
                </div>
                {active == web_url && (
                  <div className="absolute right-0 top-0 w-0.5 h-full rounded bg-primary-500"></div>
                )}
                {/* {active !== web_url && (
                    <IconDelete
                      onClick={handleRemove.bind(null, web_url)}
                      role="button"
                      className="invisible absolute right-1"
                    />
                )} */}
              </li>
            );
          })}
        </ul>
        <div className="app-no-drag w-9 h-9 flex items-center justify-center cursor-pointer rounded hover:bg-gray-500/50">
          <IconAdd role="button" className=" cursor-pointer" onClick={handleAddServer} />
        </div>
      </aside>
      <main className="w-[calc(100%_-_60px)] h-full">
        <div className="">{/* <Tabs /> */}</div>
      </main>
    </section>
  );
};

export default Layout;
