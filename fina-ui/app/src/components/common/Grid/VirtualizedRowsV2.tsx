import { cloneElement, FC, useEffect, useMemo, useState } from "react";
import throttle from "lodash/throttle";
import { getRowHeight } from "./util/gridUtils";

interface VirtualizedRowsV2Props {
  bodyRef: any;
  size: string;
  headerRef: any;
  children: any[];
  windowHeight: number;
}

const VirtualizedRowsV2: FC<VirtualizedRowsV2Props> = ({
  bodyRef,
  size,
  headerRef,
  windowHeight,
  children,
}) => {
  const itemHeight = getRowHeight(size);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    bodyRef.current.addEventListener("scroll", onScroll);
  }, []);

  const bufferedItems = 10;
  const gap = 10;

  const visibleChildren = useMemo(() => {
    let rowHeight = itemHeight;

    const startIndex = Math.max(
      Math.floor(scrollTop / rowHeight) - bufferedItems,
      0
    );
    const endIndex = Math.min(
      Math.ceil((scrollTop + windowHeight) / rowHeight - 1) + bufferedItems,
      // eslint-disable-next-line react/prop-types
      children.length - 1
    );

    // eslint-disable-next-line react/prop-types
    return children.slice(startIndex, endIndex + 1).map((child, index) =>
      cloneElement(child, {
        style: {
          width: "100%",
          position: "absolute",
          top: (startIndex + index) * rowHeight + index,
          height: rowHeight,
          lineHeight: `${rowHeight}px`,
        },
      })
    );
  }, [children, windowHeight, scrollTop, gap]);

  const onScroll = useMemo(
    () =>
      throttle(
        function (e) {
          headerRef.current.scrollLeft = e.target.scrollLeft;
          setScrollTop(e.target.scrollTop);
        },
        50,
        { leading: false }
      ),
    []
  );

  return <>{visibleChildren}</>;
};

export default VirtualizedRowsV2;
