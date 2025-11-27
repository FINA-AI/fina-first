import React, { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import InvisibleFiList from "../../FI/InvisibleFiList";

interface IntersectionObserverWrapProps {
  children: React.ReactElement;
}

const StyledToolbarWrapper = styled(Box)(() => ({
  display: "flex",
  overflow: "hidden",
  width: "100%",
  alignItems: "center",
  gap: "24px",
}));

const IntersectionObserverWrap: React.FC<IntersectionObserverWrapProps> = ({
  children,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [visibilityMap, setVisibilityMap] = useState<{
    [key: string]: boolean;
  }>({});

  const invisibleFisCount = useMemo(
    () => Object.values(visibilityMap).filter((value) => !value).length,
    [visibilityMap]
  );

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const updatedEntries: { [key: string]: boolean } = {};
    entries.forEach((entry) => {
      if (entry.target instanceof HTMLElement) {
        const targetid = entry.target.dataset.targetid as string;
        updatedEntries[targetid] = entry.isIntersecting;
      }
    });

    setVisibilityMap((prev) => ({
      ...prev,
      ...updatedEntries,
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: navRef.current,
      threshold: 1,
    });

    Array.from(navRef.current?.children || []).forEach((item) => {
      if (item instanceof HTMLElement && item.dataset.targetid) {
        observer.observe(item);
      }
    });
    return () => observer.disconnect();
  }, []);

  const invisibleFis = useMemo(() => {
    try {
      const rootChildrenArray = React.Children.toArray(children);
      const childrenArray = (rootChildrenArray[0] as React.ReactElement).props
        .children;
      return childrenArray.slice(childrenArray.length - invisibleFisCount);
    } catch (err) {
      console.error(err);
    }
  }, [children, visibilityMap]);

  return (
    <>
      <Box display={"flex"} overflow={"hidden"} width={"100%"}>
        <StyledToolbarWrapper ref={navRef}>
          {React.Children.map(children, (child) => {
            const isVisible = !!visibilityMap[child.props["data-targetid"]];
            return React.cloneElement(child, {
              style: {
                ...child.props.style,
                order: isVisible ? 0 : 100,
                visibility: isVisible ? "visible" : "hidden",
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none",
              },
            });
          })}
        </StyledToolbarWrapper>
      </Box>
      <InvisibleFiList
        children={invisibleFis}
        invisibleFisCount={invisibleFisCount}
      />
    </>
  );
};

export default IntersectionObserverWrap;
