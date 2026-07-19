import {
  useEffect,
  useRef,
  useState,
} from "react";

function DeferredRender({
  children,
  fallback = null,
  rootMargin = "500px 0px",
  minHeight,
}) {
  const containerRef =
    useRef(null);

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    if (ready) {
      return undefined;
    }

    const element =
      containerRef.current;

    if (!element) {
      return undefined;
    }

    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      setReady(true);
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setReady(true);
            observer.disconnect();
          }
        },
        {
          rootMargin,
          threshold: 0.01,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    ready,
    rootMargin,
  ]);

  return (
    <div
      ref={containerRef}
      className="min-w-0"
      style={
        !ready && minHeight
          ? {
              minHeight,
            }
          : undefined
      }
    >
      {ready
        ? children
        : fallback}
    </div>
  );
}

export default DeferredRender;