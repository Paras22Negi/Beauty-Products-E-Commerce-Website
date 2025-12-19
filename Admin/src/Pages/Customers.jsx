// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import { CardHeader, Pagination } from "@mui/material";
import { allUser } from "../Redux/Auth/Action";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Customers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const dispatch = useDispatch();
  const { userList, isLoading, currentPage, totalPages } = useSelector(
    (store) => store.auth
  );

  console.log("customers...", userList);
  const navigate = useNavigate();

  function handlePaginationChange(event, value) {
    setSearchParams({ page: value.toString() });
  }

  useEffect(() => {
    dispatch(allUser(page));
  }, [dispatch, page]);

  return (
    <Box>
      <Card
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <CardHeader
          title="All Customers"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
            "& .MuiCardHeader-title": { color: "white", fontWeight: "bold" },
          }}
        />
        <TableContainer>
          <Table sx={{ minWidth: 390 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  #
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Orders
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "white" }}>
              {userList?.map((item, index) => (
                <TableRow
                  hover
                  key={item._id}
                  sx={{
                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                    "&:hover": { backgroundColor: "#27272a !important" },
                  }}
                >
                  <TableCell sx={{ color: "white" }}>{index + 1}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "medium" }}>
                    {item.firstName && item.lastName
                      ? `${item.firstName} ${item.lastName}`
                      : item.username || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>{item.email}</TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    {item.orders?.length || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card
        className="mt-2 flex justify-center items-center"
        sx={{ bgcolor: "#18181b", color: "white", border: "1px solid #27272a" }}
      >
        <div className="py-5">
          <Pagination
            size="large"
            count={totalPages || 10}
            page={page}
            color="primary"
            onChange={handlePaginationChange}
            sx={{
              button: { color: "white" },
              ".Mui-selected": {
                bgcolor: "#4f46e5 !important", // Indigo-600
                color: "white",
              },
              ".MuiPaginationItem-ellipsis": { color: "white" },
            }}
          />
        </div>
      </Card>
    </Box>
  );
};

export default Customers;
