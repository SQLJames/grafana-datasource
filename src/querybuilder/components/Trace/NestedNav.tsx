import { css } from '@emotion/css';
import React, { FC, useState } from "react"

import { GrafanaTheme2 } from "@grafana/data";
import { IconButton, useStyles2 } from "@grafana/ui";

import Trace from "./Trace";

interface RecursiveProps {
  trace: Trace;
  totalMsec: number;
}

interface OpenLevels {
  [x: number]: boolean
}

const NestedNav: FC<RecursiveProps> = ({ trace, totalMsec }) => {
  const [openLevels, setOpenLevels] = useState({} as OpenLevels);
  const styles = useStyles2(getStyles);

  const handleListClick = (level: number) => () => {
    setOpenLevels((prevState: OpenLevels) => {
      return { ...prevState, [level]: !prevState[level] };
    });
  };
  const hasChildren = trace.children && !!trace.children.length;
  const progress = Math.round(trace.duration / totalMsec * 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} onClick={handleListClick(trace.idValue)}>
        <div className={styles.topRow}>
          <div className={styles.arrow}>
            {hasChildren && <IconButton name={openLevels[trace.idValue] ? "angle-up" : "angle-down"}/>}
          </div>
          <div className={styles.progressWrapper}>
            <div className={styles.progressLine} style={{ width: `${progress}%`, }}/>
            <div className={styles.progressNum}>{`${progress}%`}</div>
          </div>
        </div>
        <div className={styles.message}>{trace.message}</div>
        <div className={styles.duration}>{`duration: ${trace.duration} ms`}</div>
      </div>
      {openLevels[trace.idValue] && hasChildren && trace.children.map((trace) => (
        <NestedNav
          key={trace.duration}
          trace={trace}
          totalMsec={totalMsec}
        />
      ))}
    </div>
  );
};

export default NestedNav;

const getStyles = (theme: GrafanaTheme2) => ({
  wrapper: css({
    paddingLeft: theme.spacing(2),
    background: theme.colors.background.secondary,
    borderRadius: theme.shape.borderRadius(),
    border: `1px solid ${theme.colors.border.weak}`,
    position: 'relative',
    cursor: 'pointer',
  }),
  content: css`
    display: grid;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(2)};
    border-radius: ${theme.shape.borderRadius()},
  `,
  topRow: css`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
  `,
  arrow: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  progressWrapper: css`
    position: relative;
    display: grid;
    align-items: center;  
    width: calc(100% - 40px);
    height: 16px;
    background: ${theme.colors.background.secondary};
    box-shadow: inset 0 0 0 1px ${theme.colors.border.weak};
    border-radius: 4px;
  `,
  progressLine: css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: ${theme.colors.primary.main};
    border-radius: 4px;
    z-index: 1;
  `,
  progressNum: css`
    position: absolute;
    top: 0;
    right: -40px;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.bodySmall.fontSize};
    z-index: 2;
  `,
  message: css`
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
  duration: css`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
});
