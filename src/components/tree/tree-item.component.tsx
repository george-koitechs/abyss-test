import React, { useRef, useState } from "react";
import { BsCheck, MdEdit, RiCloseFill, TiPlus } from "react-icons/all";
import { Tooltip } from "@/components/tooltip/tooltip.component";
import "./tree-item.styles.scss";

export interface ITreeItem {
  id: number;
  title: string;
  level: number;
  isEdit?: boolean;
  children?: ITreeItem[];
}

interface ItemProps {
  item: ITreeItem;
  onAdd: (id: number, level: number) => void;
  onSave?: (id: number, text: string) => void;
  onRemove?: (id: number) => void;
}

export const TreeItem: React.FC<ItemProps> = ({ item, onAdd, onSave, onRemove }) => {
  const isRoot = item.id === 1;
  const [text, setText] = useState(item.title);
  const [isEdit, setIsEdit] = useState(!!item.isEdit);
  const isUpdateRef = useRef(false);

  function handleChangeText(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSaveItem();
    } else if (e.key === "Escape") {
      onRemoveItem();
    }
  }

  function onAddItem() {
    onAdd(item.id, item.level);
  }

  function onSaveItem() {
    onSave?.(item.id, text);
    setIsEdit(false);
  }

  function startUpdate() {
    setIsEdit(true);
    isUpdateRef.current = true;
  }

  function onRemoveItem() {
    if (isUpdateRef.current) {
      setIsEdit(false);
      setText(item.title);
      isUpdateRef.current = false;
    } else {
      onRemove?.(item.id);
    }
  }

  return (
    <div className="treeItem">
      <div className={`treeItem__text ${item.level > 1 && !isEdit ? `treeItem__text_${item.level}` : ""}`}>
        {isEdit ? (
          <input
            className="treeItem__input"
            type="text"
            value={text}
            onChange={handleChangeText}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        ) : (
          item.title
        )}
      </div>

      <div className="treeItem__actions">
        {isEdit ? (
          <>
            <button className="treeItem__action treeItem__action_yellow" onClick={onRemoveItem}>
              <RiCloseFill />
            </button>
            <button
              className={`treeItem__action treeItem__action_green ${!!text ? "" : "treeItem__action_hidden"}`}
              onClick={onSaveItem}
            >
              <BsCheck />
            </button>
          </>
        ) : (
          <>
            {isRoot ? (
              <button className="treeItem__action" onClick={onAddItem}>
                <TiPlus />
              </button>
            ) : (
              <Tooltip
                title="What do you want to create?"
                buttons={
                  <>
                    <button className="button button_gray" onClick={onAddItem}>
                      Category
                    </button>
                    <button className="button button_gray" disabled>
                      Service
                    </button>
                  </>
                }
              >
                <button className="treeItem__action">
                  <TiPlus />
                </button>
              </Tooltip>
            )}

            {isRoot ? null : (
              <>
                <button className="treeItem__action" onClick={startUpdate}>
                  <MdEdit />
                </button>
                <button className="treeItem__action treeItem__action_red" onClick={onRemoveItem}>
                  <RiCloseFill />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
