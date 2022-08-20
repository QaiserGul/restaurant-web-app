import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItemText,
  ListGroupItem,
  BreadcrumbItem,
  Breadcrumb,
} from "reactstrap";
import { Link } from "react-router-dom";
class Dishdetail extends Component {
  render() {
    if (this.props.dish) {
      return (
        <div className="container">
          <div className="row">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/home">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/menu">Menu</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link active>{this.props.dish.name}</Link>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
              <h3>Menu</h3>
              <hr />
            </div>
          </div>
          <div className="row">
            <div className="col col-12 col-md-5 m-1">
              <Card>
                <CardImg
                  width="inherit"
                  src={this.props.dish.image}
                  alt={this.props.dish.name}
                />
                <CardBody>
                  <CardTitle>{this.props.dish.name}</CardTitle>
                  <CardText>{this.props.dish.description}</CardText>
                </CardBody>
              </Card>
            </div>
            <div className="col col-12 col-md-5">
              <Card>
                <ListGroup>
                  <h2>Comments</h2>
                  <hr />
                  {this.props.comments.map((comment) => (
                    <ListGroupItem key={comment.id}>
                      <ListGroupItemText>
                        {comment.comment}
                        <br />
                        {comment.rating}
                        <br />
                        {comment.author}{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }).format(new Date(Date.parse(comment.date)))}
                      </ListGroupItemText>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card>
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Dishdetail;
