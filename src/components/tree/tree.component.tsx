import React, { useState } from "react";
import { ITreeItem, TreeItem } from "@/components/tree/tree-item.component";
import "./tree.styles.scss";

interface RenderItemOptions {
  item: ITreeItem;
  onSave?: (id: number, text: string) => void;
  onRemove?: (id: number) => void;
  onAdd: (id: number, level: number) => void;
}

function renderItem(options: RenderItemOptions) {
  const { item, onSave, onAdd, onRemove } = options;

  return (
    <li key={item.id}>
      <TreeItem item={item} onAdd={onAdd} onSave={onSave} onRemove={onRemove} />
      {"children" in item && !!item.children?.length && (
        <ul>{item.children?.map((child) => renderItem({ item: child, onSave, onAdd, onRemove }))}</ul>
      )}
    </li>
  );
}

function updateItem(items: ITreeItem[], id: number, text: string): ITreeItem[] {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, title: text, isEdit: false };
    } else if (item.children) {
      const updatedChildren = updateItem(item.children, id, text);
      return { ...item, children: updatedChildren };
    }
    return item;
  });
}

function removeItem(items: ITreeItem[], id: number): ITreeItem[] {
  return items.filter((item) => {
    if (item.id === id) {
      return false;
    } else if (item.children) {
      item.children = removeItem(item.children, id);
    }
    return true;
  });
}

interface TreeProps {
  centerTree: () => void;
}

export const Tree: React.FC<TreeProps> = ({ centerTree }) => {
  const [items, setItems] = useState<ITreeItem[]>([]);

  function onRootAdd() {
    setItems((prev) => [...prev, { id: Date.now(), title: "", isEdit: true, level: 2 }]);
  }

  function onSave(id: number, text: string) {
    setItems((prev) => updateItem(prev, id, text));
    centerTree();
  }

  function onRemove(id: number) {
    const updatedItems = removeItem(items, id);
    setItems(updatedItems);
  }

  const onAdd = (id: number, level: number) => {
    const newItem: ITreeItem = { id: Date.now(), title: "", isEdit: true, level };

    const addItemToNested = (nestedItems: ITreeItem[], currentLevel: number): ITreeItem[] => {
      return nestedItems.map((item) => {
        if (item.id === id) {
          if (!item.children) {
            item.children = [];
          }
          item.children.push({ ...newItem, level: currentLevel + 1 });
        } else if (item.children) {
          item.children = addItemToNested(item.children, currentLevel);
        }
        return item;
      });
    };

    const updatedItems = addItemToNested(items, level);
    setItems(updatedItems);
  };

  return (
    <div className="tree">
      <ul>
        <li>
          <TreeItem item={{ id: 1, title: "Categories", level: 1 }} onAdd={onRootAdd} />
          {!!items.length && <ul>{items.map((item) => renderItem({ item, onSave, onAdd, onRemove }))}</ul>}
        </li>
      </ul>
    </div>
  );
};
