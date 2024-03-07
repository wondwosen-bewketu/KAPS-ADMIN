import React from "react";
import { Typography, Card, CardContent, Box } from "@mui/material";
import { LocationOn, MonetizationOn, Event } from "@mui/icons-material";
import { AiOutlineShopping } from "react-icons/ai";
import { IoIosTrophy } from "react-icons/io";

import styled from "@emotion/styled";

const StyledCard = styled(Card)`
  margin-bottom: 1rem; /* Adjust the margin between cards */
  padding: 1rem; /* Add padding around the content */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const InfoCard = ({ title, data }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography
          variant="h6"
          gutterBottom
          style={{ color: "#333", marginBottom: "0.5rem" }}
        >
          {title}
        </Typography>
        {data ? (
          <div>
            {title === "Total Agents" ? (
              <IconWrapper>
                <IoIosTrophy
                  style={{
                    marginRight: "0.5rem",
                    color: "#FFD700",
                    fontSize: "4rem",
                  }}
                />
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  {data.totalAgents}
                </Typography>
              </IconWrapper>
            ) : title === "Total Items" ? (
              <IconWrapper>
                <AiOutlineShopping
                  style={{
                    marginRight: "0.5rem",
                    color: "#4CAF50",
                    fontSize: "4rem",
                  }}
                />
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  {data.totalItems}
                </Typography>
              </IconWrapper>
            ) : (
              <>
                <IconWrapper>
                <AiOutlineShopping
                    style={{
                      marginRight: "0.5rem",
                      color: "#e74c3c",
                      fontSize: "2rem",
                    }}
                  />
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    {data.productname}
                  </Typography>
                </IconWrapper>
                <IconWrapper>
                  <LocationOn
                    style={{
                      marginRight: "0.5rem",
                      color: "#3498db",
                      fontSize: "2rem",
                    }}
                  />
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    {data.productlocation}
                  </Typography>
                </IconWrapper>

                {/* <IconWrapper>
                  <MonetizationOn
                    style={{
                      marginRight: "0.5rem",
                      color: "#e74c3c",
                      fontSize: "2rem",
                    }}
                  />
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    {data.productprice}
                  </Typography>
                </IconWrapper> */}
                {/* Add more data and icons as needed */}
              </>
            )}
          </div>
        ) : (
          <Typography variant="body1" style={{ color: "#666" }}>
            No data available
          </Typography>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

export default InfoCard;
