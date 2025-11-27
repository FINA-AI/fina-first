import { AutoSizer, List } from "react-virtualized";
import React from "react";
import { Box } from "@mui/system";

interface ListBoxComponentProps {
  children: React.ReactNode[];
  role: string;
  style: React.CSSProperties;
}

const ListBoxComponent = React.forwardRef<
  HTMLDivElement,
  ListBoxComponentProps
>(function ListBoxComponent(props, ref) {
  const { children, role, style, ...other } = props;
  const itemCount = Array.isArray(children) ? children.length : 0;
  const itemSize = 36;

  return (
    <div ref={ref}>
      <div {...other}>
        <Box height={style.maxHeight} width={(style?.width as number) - 8}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                rowHeight={itemSize}
                overscanCount={5}
                rowCount={itemCount}
                rowRenderer={({ index, style }) => {
                  const child = children[index];
                  return React.cloneElement(child as React.ReactElement, {
                    style,
                    key: index,
                  });
                }}
                role={role}
              />
            )}
          </AutoSizer>
        </Box>
      </div>
    </div>
  );
});

export default ListBoxComponent;
