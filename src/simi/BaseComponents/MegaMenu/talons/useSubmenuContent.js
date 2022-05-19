import { useCallback, useEffect, useState } from 'react';

export const useSubMenuContent = props => {
  const { id } = props;
  const [activeId, setActiveId] = useState(id);

  const onHover = useCallback(_id => setActiveId(_id), [setActiveId]);

  useEffect(() => {
    return () => setActiveId(id);
  }, [setActiveId, id]);

  return {
    activeId,
    onHover
  };
};
