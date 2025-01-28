import { Spinner, Progress } from "flowbite-react";
import { useServices } from "~/contexts/ServiceContext";
function Loading() {
  const { progress } = useServices();
  return (
    <div className="absolute w-full h-full overflow-hidden bg-gray-900 bg-opacity-50 pointer-events-auto flex flex-col gap-4 items-center justify-center z-[11]">
      {progress !== 0 ? (
        <>
          <p className="text-secondary-100">Loading information...</p>
          <Progress
            theme={{
              base: "w-full min-w-[400px] overflow-hidden rounded-full bg-white dark:bg-gray-700",
              label: "flex justify-between font-medium dark:text-white",
              bar: "space-x-2 rounded-full text-center font-medium leading-none text-secondary-100",
              color: {
                cyan: "bg-secondary",
              },
              size: {
                sm: "h-1.5",
                md: "h-2.5",
                lg: "h-4",
                xl: "h-6",
              },
            }}
            progress={parseFloat(progress.toFixed(2))}
            size="lg"
            labelProgress
          />
        </>
      ) : (
        <Spinner size="lg" />
      )}
    </div>
  );
}

export default Loading;
