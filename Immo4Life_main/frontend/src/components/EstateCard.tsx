/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardMedia, CardContent, Typography, CardActions, IconButton, styled, IconButtonProps, Collapse } from '@mui/material';
import React, { useState } from 'react';
import { Listing, RealEstateType } from '../resources';
import { Favorite, ExpandMore as ExpandMoreIcon, House, Apartment, Construction, Edit, Visibility } from '@mui/icons-material';
import defaultImage from '../images/default.jpg';

interface EstateCardProps {
    listing: Listing;
    heartClick: (id: number) => void;
    handleEdit: (id: number) => void;
    handleDetail: (id: number) => void;
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

/**
 * Das Icon zum Erweitern der Detailinformationen
 */
const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

/**
 * Ermittelt das anzuzeigende Bild für den Immobilientyp
 * @param type Den Immobilientyp
 * @returns Das Bild zu dem Immobilientyp
 */
const iconByType = (type: RealEstateType) => {
    switch (type) {
        case RealEstateType.APARTMENT: {
            return <Apartment />;
        }
        case RealEstateType.CONSTRUCTION_SITE: {
            return <Construction />;
        }
        case RealEstateType.HOUSE:
        default: {
            return <House />;
        }
    }
};

/**
 * Die Immoblienkarte für das Dashboard
 * @param listing - Die anzuzeigende Immobilie
 * @param heartClick - Methode, um den Favoriten zu markieren
 * @param handleEdit - Methode, um die Immobilie zu editieren
 * @param handleDetail - Methode, um die Detailansicht der Immobilie anzuzeigen
 * @returns Die fertige Karte für das Dashboard
 */
export const EstateCard: React.FC<EstateCardProps> = ({ listing, heartClick, handleEdit, handleDetail }) => {
    const [expandedCard, setExpandedCard] = useState(false);
    const [heartClicked, setHeartClicked] = useState(false);

    /**
     * Wechselt die Detailsansicht
     */
    const handleExpandClick = () => {
        setExpandedCard(!expandedCard);
    };

    /**
     * Handler für das Favorisieren der Immobilie
     */
    const handleHeartClick = () => {
        if (!heartClicked) {
            setHeartClicked(true);
            heartClick(listing.id);
        }
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    };
    const dateString = new Date(listing.createdOn ?? '').toLocaleString('de-DE', dateOptions);

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <Card className="h-full flex flex-col">
                <CardMedia className="max-h-48" component="img" src={listing.entry.image ? `${listing.entry.image}` : defaultImage} />
                <CardContent className="flex-grow">
                    <Typography gutterBottom variant="h5" component="h2">
                        {listing.entry.shortHand}
                    </Typography>
                    <Typography>
                        {listing.entry.address}, {listing.entry.postal} {listing.entry.city}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton onClick={() => handleHeartClick()}>
                        <Favorite color={heartClicked ? 'error' : undefined} />
                        <Typography className="pl-1">{listing.entry.customerCount}</Typography>
                    </IconButton>
                    <IconButton onClick={() => handleEdit(listing.id)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDetail(listing.id)}>
                        <Visibility />
                    </IconButton>
                    <ExpandMore expand={expandedCard} onClick={handleExpandClick} aria-expanded={expandedCard} aria-label="show more">
                        <ExpandMoreIcon />
                    </ExpandMore>
                    <div className="w-full flex justify-end mr-2">
                        <Typography>
                            {listing.entry.size} m<sup>2</sup>
                        </Typography>
                    </div>
                </CardActions>
                <Collapse in={expandedCard} timeout="auto" unmountOnExit>
                    <CardContent>
                        <div className="inline-flex gap-2">
                            {iconByType(listing.entry.type)}
                            <Typography paragraph>Besitzer: {listing.createdBy}</Typography>
                        </div>
                        <Typography paragraph>Eintrag erstellt am: {dateString}</Typography>
                        <Typography>{`„${listing.entry.comment}"`}</Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
};
