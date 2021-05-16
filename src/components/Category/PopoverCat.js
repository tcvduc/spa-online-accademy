import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Subcategory from "./Subcategory";

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  popover: {
    boxShadow: "none!important",
    textTransform: "initial",
    "&.MuiButton-root": {
      padding: "0!important",
    },
    "&.MuiPaper-root": {
      transition: 0,
    },
  },
  popover_cat: {
    transition: 0,
  },
}));

export default function PopoverCat({
  title,
  categories,
  sub_mobi_cat,
  sub_web_cat,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [close, set_close] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    set_close(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (close === true) {
      handleClose();
    }
  }, [close]);

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="text"
        color="inherit"
        className={classes.popover}
        onClick={handleClick}
      >
        <Typography variant="h6"> {title}</Typography>
      </Button>
      <Popover
        className={classes.popover_cat}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {categories.map((e, i) => {
          return (
            <Subcategory
              key={i}
              set_cat_close={set_close}
              sub_mobi_cat={e.cat_id === 2 ? sub_mobi_cat : []}
              sub_web_cat={e.cat_id === 1 ? sub_web_cat : []}
              className={classes.typography}
              cat_name={e.cat_name}
            />
          );
        })}
      </Popover>
    </div>
  );
}